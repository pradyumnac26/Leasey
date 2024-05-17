import json
import faker
import random
import uuid
import boto3
import requests

def lambda_handler(event, context):

    
    # API_KEY = "6c415d3f85754ca0b29b03e8abb4d4b3"

    # url = f"https://api.rentcast.io/v1/listings/rental/long-term?state={stateName}&status=Active&limit=5"

    # headers = {"accept": "application/json",
    #            "X-API-Key": API_KEY}

    # response = requests.get(url, headers=headers)

    # data = response.json()
    # # Extract relevant data from the API response
    # private_rent = 0
    # shared_rent = 0
    # c = 0
    # for listing in data:
    #     try:
    #         rent = round(listing['price']/listing['bedrooms'], 2)
    #         private_rent += rent
    #         shared_rent += round(rent/2, 2)
    #         c += 1
    #     except:
    #         pass
    # obj = {
    #     'objectId':  str(uuid.uuid4()),
    #     'private_rent': private_rent/c,
    #     'shared_rent': shared_rent/c,
    #     'stateName': stateName
    # }

    obj = {
        'objectId': str(uuid.uuid4()),
        'private_rent': 1000,
        'shared_rent': 500,
        'stateName': 'New York',
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