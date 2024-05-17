import boto3
import json

sqs_client = boto3.client('sqs')
dynamodb_client = boto3.resource('dynamodb')
sns_client = boto3.client('sns')

queue_url = 'https://sqs.us-east-1.amazonaws.com/975050099506/LeaseyDataCreator'
listings_table = dynamodb_client.Table('existing_listings_rent')
topic_arn = 'arn:aws:sns:us-east-1:975050099506:analysis'

def poll_messages_from_sqs():
    response = sqs_client.receive_message(
        QueueUrl=queue_url
    )

    count = 0
    for message in response.get('Messages', []):
        message_body = json.loads(message['Body'])

        obj = {
            "objectId": message_body["objectId"],
            "private_rent": message_body["private_rent"],
            "shared_rent": message_body["shared_rent"],
            "stateName": message_body["state"],
        }

        listings_table.put_item(
            Item=obj
        )

        sqs_client.delete_message(
            QueueUrl=queue_url,
            ReceiptHandle=message['ReceiptHandle']
        )

        count += 1

    sns_client.publish(
        TopicArn=topic_arn,
        Message="created"
    )

    return count

def lambda_handler(event, context):
    count = poll_messages_from_sqs()
    return {
        'statusCode': 200,
        'body': f'Messages processed successfully, count: {count}'
    }

print(lambda_handler(None, None))