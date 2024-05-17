import pytest
import app
import os


@pytest.fixture
def client():
    os.environ["SNS_TOPIC_ARN"] = "arn:aws:sns:us-east-1:975050099506:analysis"
    yield app.app.test_client()

def test_create_listing_success(client):
    response = client.post('/login', json={
        'email': 'test@gmail.com', 'password': 'pass123'})
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

def test_create_listing_failure(client):
    response = client.post('/create_listing', data={
        'address': '123 Main St',
        'zipcode': '12345',
        'stateName': 'California',
        'university': 'San Francisco State University',
        'price': '1000',
        'roomtype': 'Private',
        'bathroomtype': 'Attached',
        'description': 'Thsis is a nice place',
        'amenities': 'Wifi',
        'leaseTerm': '12 months',
        'images': []
    })
    assert response.status_code == 401

def test_view_listings_success(client):

    response = client.get('/view_listings')

    assert response.status_code == 200
    assert 'data' in response.json

def test_user_listings_success(client):
    response = client.post('/login', json={
        'email': 'test@gmail.com', 'password': 'pass123'})
    assert response.status_code == 200
    response = client.get('/view_user_listings',  headers={'Authorization': 'Bearer ' + response.json['access_token']})

    assert response.status_code == 200

def test_user_listings_failure(client):
    response = client.get('/view_user_listings')

    assert response.status_code == 401
    
def test_delete_listing_success(client):
    response = client.post('/login', json={
        'email': 'test@gmail.com', 'password': 'pass123'})
    assert response.status_code == 200
    response2 = client.get('/view_user_listings',  headers={'Authorization': 'Bearer ' + response.json['access_token']})
    assert response2.status_code == 200
    listing_id = response2.json['data'][0]['objectId']
    response = client.post('/delete_listing', json={'id': listing_id},   headers={'Authorization': 'Bearer ' + response.json['access_token']})
    assert response.status_code == 200

def test_delete_listing_faiure(client):
    response = client.post('/login', json={
        'email': 'test@gmail.com', 'password': 'pass123'})
    assert response.status_code == 200
    response2 = client.get('/view_user_listings',  headers={'Authorization': 'Bearer ' + response.json['access_token']})
    assert response2.status_code == 200
    listing_id = response2.json['data'][0]['objectId']
    response = client.post('/delete_listing', json={'id': listing_id})
    assert response.status_code == 401
