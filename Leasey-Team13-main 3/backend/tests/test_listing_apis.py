import boto3
import pytest
import os
from moto import mock_aws
from app import create_app
from boto3.dynamodb.conditions import Attr

@pytest.fixture(scope = 'session',autouse=True)
def app():
    with mock_aws():
        database = boto3.resource('dynamodb', region_name='us-east-1')
        database.create_table(
            TableName='LeasyUsers',
            KeySchema=[
                {
                    'AttributeName': 'email',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        database.create_table(
            TableName='listings',
            KeySchema=[
                {
                    'AttributeName': 'objectId',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'objectId',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        app = create_app(database, "somerandomkey")
        conn = boto3.client("sns", region_name="us-east-1")
        created = conn.create_topic(Name="some-topic")
        topic_arn = created.get('TopicArn')
    
        os.environ["SNS_TOPIC_ARN"] = topic_arn
        os.environ["AWS_ACCESS_KEY_ID"] = "testing"
        os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
        os.environ["AWS_SECURITY_TOKEN"] = "testing"
        os.environ["AWS_SESSION_TOKEN"] = "testing"
        os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
        yield app

@pytest.fixture(scope = 'session', autouse=True)
def client(app):
    test_client = app.test_client()
    response = test_client.post('/register', json={
        'email': 'test1@gmail.com', 'username': 'test', 'password': 'test'})
    assert response.status_code == 200
    yield test_client

@pytest.fixture()
def before_all(client):
    response = client.post('/login', json={
        'email': 'test1@gmail.com', 'password': 'test'})
    assert response.status_code == 200
    response = client.post('/create_listing', data={
        'address': '123 Main St',
        'zipcode': '12345',
        'stateName': 'California',
        'university': 'San Francisco State University',
        'price': '1000',
        'roomtype': 'Private',
        'bathroomtype': 'Common',
        'description': 'This is a nice place',
        'amenities': 'Wifi',
        'leaseTerm': '12',
        'images': []
    },  headers={'Authorization': 'Bearer ' + response.json['access_token']})
    yield

def test_create_listing(client):
    response = client.post('/login', json={
        'email': 'test1@gmail.com', 'password': 'test'})
    assert response.status_code == 200
    response = client.post('/create_listing', data={
        'address': '123 Main St',
        'zipcode': '12345',
        'stateName': 'California',
        'university': 'San Francisco State University',
        'price': '1000',
        'roomtype': 'Private',
        'bathroomtype': 'Attached',
        'description': 'This is a nice place',
        'amenities': 'Wifi',
        'leaseTerm': '12 months',
        'images': []
    },  headers={'Authorization': 'Bearer ' + response.json['access_token']})
    assert response.status_code == 200

def test_view_listings(client):

    response = client.get('/view_listings')

    assert response.status_code == 200
    assert 'data' in response.json

def test_user_listings(client):
    response = client.post('/login', json={
        'email': 'test1@gmail.com', 'password': 'test'})
    assert response.status_code == 200
    response = client.get('/view_user_listings',  headers={'Authorization': 'Bearer ' + response.json['access_token']})

    assert response.status_code == 200
    
def test_delete_listing(client):
    response = client.post('/login', json={
        'email': 'test1@gmail.com', 'password': 'test'})
    assert response.status_code == 200
    response2 = client.get('/view_user_listings',  headers={'Authorization': 'Bearer ' + response.json['access_token']})
    assert response2.status_code == 200
    listing_id = response2.json['data'][0]['objectId']
    response = client.post('/delete_listing', json={'id': listing_id},   headers={'Authorization': 'Bearer ' + response.json['access_token']})
    assert response.status_code == 200
