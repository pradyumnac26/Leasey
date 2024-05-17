import os
import uuid
import boto3
from flask import Blueprint, request, make_response
from flask_jwt_extended import current_user, jwt_required
from boto3.dynamodb.conditions import Attr
from datacollector import data_collector
from helper_funcs import create_dataframe, sns_publish

listings_bp = Blueprint('listings', __name__)

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamodb_client = boto3.client('dynamodb')

table = dynamodb.Table('LeasyUsers')
listings_table = dynamodb.Table('listings')
stateAnalysisTable = dynamodb.Table('StateAnalysisResults')
universityAnalysisTable = dynamodb.Table('UniversityAnalysisResults')
existing_listings_rent = dynamodb.Table('existing_listings_rent')
s3 = boto3.resource('s3', region_name='us-east-1')

@listings_bp.route('/create_listing', methods=['POST'])
@jwt_required()
def create_listing():
    email = current_user['email']
    
    response = table.get_item(
        Key={
            'email': email
        }
    )

    if ('Item' not in response):
        return make_response({'data': "User not found"}, 404)
    
    userName = response['Item']['username']
    objectId = str(uuid.uuid4())
    address = request.form.get('address')
    zipcode = request.form.get('zipcode')
    stateName = request.form.get('stateName')
    university = request.form.get('university')
    price = request.form.get('price')
    roomtype = request.form.get('roomtype')
    bathroomtype = request.form.get('bathroomtype')
    description = request.form.get('description')
    amenities = request.form.get('amenities')
    startDate = request.form.get('startDate')
    endDate = request.form.get('endDate')
    files = request.files.getlist('file')
    filenames = []
    count = 0
    for file in files:
        file.save(file.filename)
        keyname = f"{objectId}_{str(count)}.{file.filename.split('.')[-1]}"
        s3.Bucket('leasey-images').upload_file(Filename=file.filename, Key=keyname)
        count += 1
        os.remove(file.filename)
        filenames.append(keyname)
    obj = {
        "objectId": objectId,
        "address": address,
        "zipcode": zipcode,
        "stateName": stateName,
        "university": university,
        "price": price,
        "roomtype": roomtype,
        "bathroomtype": bathroomtype,
        "description": description,
        "amenities": amenities,
        "images": filenames,
        "email": email,
        "startDate": startDate,
        "endDate": endDate,
        "userName": userName
    }

    listings_table.put_item(Item=obj)
    response = listings_table.scan()
    listings = response['Items']

    while 'LastEvaluatedKey' in response:
        response = listings_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        listings.extend(response['Items'])
    response = make_response({'data': listings})
    response.status_code = 200
    sns_publish("created")
    return response

@listings_bp.route('/view_listings', methods=['GET'])
def view_listings():
    response = listings_table.scan()
    listings = response['Items']

    while 'LastEvaluatedKey' in response:
        response = listings_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        listings.extend(response['Items'])
    response = make_response({'data': listings})
    response.status_code = 200
    return response

@listings_bp.route('/view_user_listings', methods=['GET'])
@jwt_required()
def view_user_listings():
    email = current_user['email']
    response = listings_table.scan(
        FilterExpression=Attr('email').eq(email)
    )
    listings = response['Items']

    while 'LastEvaluatedKey' in response:
        response = listings_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        listings.extend(response['Items'])
    response = make_response({'data': listings})
    response.status_code = 200
    return response


@listings_bp.route('/edit_listing', methods=['POST'])
@jwt_required()
def edit_listing():
    listing_id = request.form.get('id')
    response = listings_table.get_item(
        Key={
            'objectId': listing_id
        }
    )

    if ('Item' not in response):
        return make_response({'data': "Listing not found"}, 404)
    
    if (response['Item']['email'] != current_user['email']):
        return make_response({'data': "You are not authorized to edit this listing"}, 403)
    
    address = request.form.get('address')
    zipcode = request.form.get('zipcode')
    stateName = request.form.get('stateName')
    university = request.form.get('university')
    price = request.form.get('price')
    roomtype = request.form.get('roomtype')
    bathroomtype = request.form.get('bathroomtype')
    description = request.form.get('description')
    amenities = request.form.get('amenities')
    startDate = request.form.get('startDate')
    endDate = request.form.get('endDate')


    listings_table.update_item(
        Key={
            'objectId': listing_id
        },
        UpdateExpression='SET address = :address, zipcode = :zipcode, stateName = :stateName, university = :university, price = :price, roomtype = :roomtype, bathroomtype = :bathroomtype, description = :description, amenities = :amenities, startDate = :startDate, endDate = :endDate',

        ExpressionAttributeValues={
            ':address': address,
            ':zipcode': zipcode,
            ':stateName': stateName,
            ':university': university,
            ':price': price,
            ':roomtype': roomtype,
            ':bathroomtype': bathroomtype,
            ':description': description,
            ':amenities': amenities,
            ':startDate': startDate,
            ':endDate': endDate
        }
    )
    sns_publish("updated")
    return make_response({'data': "Updated the listing"})

@listings_bp.route('/delete_listing', methods=['POST'])
@jwt_required()
def delete_listing():
    data = request.get_json()
    listing_id = data.get('id')
    response = listings_table.get_item(
        Key={
            'objectId': listing_id
        }
    )

    if ('Item' not in response):
        return make_response({'data': "Listing not found"}, 404)
    
    if (response['Item']['email'] != current_user['email']):
        return make_response({'data': "You are not authorized to delete this listing"}, 403)
    
    listings_table.delete_item(
        Key={
            'objectId': listing_id
        }
    )
    sns_publish("deleted")
    return make_response({'data': "Deleted the listing"})

@listings_bp.route('/analysis', methods=['GET'])
def analysis():
    response = listings_table.scan()
    listings = response['Items']

    while 'LastEvaluatedKey' in response:
        response = listings_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        listings.extend(response['Items'])

    listings = create_dataframe(listings)
    response = make_response({'data': listings})

    response.status_code = 200
    return response

@listings_bp.route('/state_analysis', methods=['GET'])
def state_analysis():
    state = request.args.get('state')
    response = stateAnalysisTable.get_item(
        Key={
            'Id': state
        }
    )

    if ('Item' not in response):
        return make_response({'data': None}, 404)
    
    response = make_response({'data': response['Item']})
    response.status_code = 200
    return response

@listings_bp.route('/university_analysis', methods=['GET'])
def university_analysis():
    university = request.args.get('university')
    response = universityAnalysisTable.get_item(
        Key={
            'Id': university
        }
    )

    if ('Item' not in response):
        return make_response({'data': None}, 404)
    
    response = make_response({'data': response['Item']})
    response.status_code = 200
    return response

@listings_bp.route('/existing_state_rent', methods=['GET'])
def existing_state_rent():
    stateName = request.args.get('state')
    print(stateName)

    stateName_key = data_collector(stateName)

    query_params = {
        'TableName': 'existing_listings_rent',
        'KeyConditionExpression': 'objectId = :state',
        'ExpressionAttributeValues': {
            ':state': {'S': stateName_key}
        }
    }

    response = dynamodb_client.query(**query_params)


    if 'Items' not in response:
        return make_response({'data': None}, 404)
    items = response['Items'][0]
    rent_data = {}
    for item in items:
        if 'N' in items[item]:
            rent_data[item] = items[item]['N']
        else:
            rent_data[item] = items[item]['S']
    print("RENT DATA: ", rent_data)

    response = make_response({'data': rent_data})
    response.status_code = 200

    return response