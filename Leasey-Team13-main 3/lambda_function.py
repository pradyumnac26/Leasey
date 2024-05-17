import json
import faker
import random
import uuid
import boto3

def lambda_handler(event, context):
    # TODO implement

    universities = json.load(open('us_universities.json', 'r'))
    del universities['']
    
    amenities_list = ['Gym', 'Pool', 'WiFi', 'Parking', 'Laundry', 'Balcony', 'AC', 'Heater', 'Clubhouse', 'Rooftop', 'Lawn', 'Park', 'Playground', 'Trash', 'Elevator', 'Security Guard']
    state_list = list(universities.keys())
    users = [['kaushik@gmail.com', 'kaushik'], ['gopi@gmail.com', 'gopi'], ['praddy@gmail.com', 'praddy']]
    fake = faker.Faker()

    (email, username) = random.choice(users)
    objectId = str(uuid.uuid4())
    address = fake.street_address()
    zipcode = fake.zipcode()
    state = random.choice(state_list)
    university = random.choice(universities[state])
    price = random.choice(list(range(300, 1300, 50)))  # Rent per month
    roomtype = random.choice(['Shared', 'Private'])
    bathroomtype = random.choice(['Common', 'Attached'])
    description = fake.text()
    num_of_amenities = random.choice(list(range(1, len(amenities_list))))
    amenities = random.sample(amenities_list, num_of_amenities)
    startDate = fake.date_time_between(start_date='-1y', end_date='now')
    endDate = fake.date_time_between_dates(datetime_start=startDate, datetime_end='+1y')
    images = ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"]

    obj = {
        'objectId': objectId,
        'address': address,
        'zipcode': zipcode,
        'state': state,
        'university': university,
        'price': price,
        'roomtype': roomtype,
        'bathroomtype': bathroomtype,
        'description': description,
        'amenities': json.dumps(amenities),
        'startDate': startDate.isoformat(),
        'endDate': endDate.isoformat(),
        'email': email,
        'username': username,
        'images': images,
    }

    sqs = boto3.client('sqs')

    queue_url = 'https://sqs.us-east-1.amazonaws.com/975050099506/LeaseyDataCreator'
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(obj)
    )

    if response['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'statusCode': 500,
            'body': "Error sending message to SQS Queue!"
        }
    
    return {
        'statusCode': 200,
        'body': "Message sent to SQS Queue!"
    }