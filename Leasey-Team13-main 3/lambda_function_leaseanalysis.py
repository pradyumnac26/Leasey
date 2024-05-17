import json
import pandas as pd
import boto3
import numpy as np
from decimal import Decimal

def get_price_by_state(selected_state, state, price, roomtype):
    temp = []
    temp1 = []

    # Loop through the arrays and filter prices for the selected state
    for s, p, rt in zip(state, price, roomtype):
        if s == selected_state:
            temp.append(p)
            temp1.append(rt)

    return temp1, temp
    
def get_price_by_university(selected_university, university, price, roomtype):
    temp = []
    temp1 = []


    # Loop through the arrays and filter prices for the selected university
    for univ, p, rt in zip(university, price, roomtype):
        if univ == selected_university:
            temp.append(p)
            temp1.append(rt)


    return temp1, temp


def get_p_count(rooms):
    count = 0
    for room in rooms:
        if room == "Private":
            count += 1
    return count

def get_s_count(rooms):
    count = 0
    for room in rooms:
        if room == "Shared":
            count += 1
    return count

def get_p_avg(rooms, prices):
    sum_ = 0
    count = get_p_count(rooms)
    for room, price in zip(rooms, prices):
        if room == "Private":
            sum_ += float(price)
    return round(sum_ / count, 2) if count != 0 else 0.00

def get_s_avg(rooms, prices):
    sum_ = 0
    count = get_s_count(rooms)
    for room, price in zip(rooms, prices):
        if room == "Shared":
            sum_ += float(price)
    return round(sum_ / count, 2) if count != 0 else 0.00


def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    listings_table = dynamodb.Table('listings')
    
    response = listings_table.scan()
    listings = response['Items']

    while 'LastEvaluatedKey' in response:
        response = listings_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        listings.extend(response['Items'])
        
    address, zipcode, state, university, price, roomtype, bathroomtype, description, amenities, leaseTerm, images = [],[],[],[],[],[],[],[],[],[],[]

    for listing in listings:
        address.append(listing['address'])
        zipcode.append(listing['zipcode'])
        state.append(listing['stateName'])
        university.append(listing['university'])
        price.append(listing['price'])
        roomtype.append(listing['roomtype'])
        bathroomtype.append(listing['bathroomtype'])
        description.append(listing['description'])
        amenities.append(','.join(w for w in listing['amenities']))

    df = {
        "state": state,
        "university": university,
        "price": price,
        "roomtype": roomtype,
    }
    
    state_analysis_table = dynamodb.Table('StateAnalysisResults')
    
    
    for stateName in pd.unique(df['state']):
        temp_room_type, temp_rent = get_price_by_state(stateName, df['state'], df['price'], df['roomtype'])
        p_count = get_p_count(temp_room_type)
        s_count = get_s_count(temp_room_type)
        p_avg = get_p_avg(temp_room_type, temp_rent)
        s_avg = get_s_avg(temp_room_type, temp_rent)
        obj = {
            'Id': stateName,
            '#PrivateRooms': p_count,
            '#SharedRooms': s_count,
            'Avg_Private_Room_Rent': Decimal(str(p_avg)),
            'Avg_Shared_Room_Rent': Decimal(str(s_avg)),
            'totalCount': p_count + s_count
        }
        
        state_analysis_table.put_item(Item=obj)
        
    university_analysis_table = dynamodb.Table("UniversityAnalysisResults")
    
    for universityName in pd.unique(df['university']):
        temp_room_type, temp_rent = get_price_by_university(universityName, df['university'], df['price'], df['roomtype'])
        p_count = get_p_count(temp_room_type)
        s_count = get_s_count(temp_room_type)
        p_avg = get_p_avg(temp_room_type, temp_rent)
        s_avg = get_s_avg(temp_room_type, temp_rent)
        obj = {
            'Id': universityName,
            '#PrivateRooms': p_count,
            '#SharedRooms': s_count,
            'Avg_Private_Room_Rent': Decimal(str(p_avg)),
            'Avg_Shared_Room_Rent': Decimal(str(s_avg)),
            'totalCount': p_count + s_count
        }
        
        university_analysis_table.put_item(Item=obj)
    
    
