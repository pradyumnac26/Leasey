import os
import pytest
import boto3
from app import create_app
from moto import mock_aws

@pytest.fixture
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
        app = create_app(database, "somerandomkey")
        os.environ["AWS_ACCESS_KEY_ID"] = "testing"
        os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
        os.environ["AWS_SECURITY_TOKEN"] = "testing"
        os.environ["AWS_SESSION_TOKEN"] = "testing"
        os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
        yield app

@pytest.fixture
def client(app):
    yield app.test_client()

def test_register_user(client):
    response = client.post('/register', json={
        'email': 'test@gmail.com', 'username': 'test', 'password': 'test'})
    assert response.status_code == 200

    response = client.post('/register', json={
        'email': 'test@gmail.com', 'username': 'test', 'password': 'test'})
    assert response.status_code == 400


def test_login_user(client):
    response = client.post('/register', json={
        'email': 'test@gmail.com', 'username': 'test', 'password': 'test'})
    assert response.status_code == 200

    response = client.post('/login', json={
        'email': 'test@gmail.com', 'password': 'test'})
    assert response.status_code == 200

    response = client.post('/login', json={
        'email': 'test@gmail.com', 'password': 'wrong'})
    assert response.status_code == 400

def test_get_user(client):
    response = client.post('/register', json={
        'email': 'test@gmail.com', 'username': 'test', 'password': 'test'})
    assert response.status_code == 200

    response = client.post('/login', json={
        'email': 'test@gmail.com', 'password': 'test'})
    assert response.status_code == 200

    response = client.get('/get-user', headers={'Authorization': 'Bearer ' + response.json['access_token']})
    assert response.status_code == 200
    assert response.json[0]['email'] == 'test@gmail.com'

def test_logout_user(client):
    response = client.post('/register', json={
        'email': 'test@gmail.com', 'username': 'test', 'password': 'test'})
    assert response.status_code == 200

    response = client.post('/login', json={
        'email': 'test@gmail.com', 'password': 'test'})
    assert response.status_code == 200

    access_token = response.json['access_token']
    response = client.get('/logout', headers={'Authorization': 'Bearer ' + access_token})
    assert response.status_code == 200
    assert response.json[0]['msg'] == 'Token revoked successfully!'

    response = client.get('/get-user', headers={'Authorization': 'Bearer ' + access_token})
    assert response.status_code == 401