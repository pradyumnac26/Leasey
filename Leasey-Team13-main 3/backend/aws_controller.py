from werkzeug.security import check_password_hash
from flask import current_app
import boto3


def create_user(email, username, password):
    table = current_app.database.Table('LeasyUsers')
    response = table.get_item(
        Key={
            'email': email
        }
    )

    if 'Item' in response:
        return {'msg': 'User already exists!'}, 400
    
    table.put_item(
        Item={
            'email': email,
            'username': username,
            'password': password
        }
    )

    return {'msg': 'User registered successfully!'}, 200

def login_user(email, password):
    table = current_app.database.Table('LeasyUsers')
    response = table.get_item(
        Key={
            'email': email
        }
    )
    if 'Item' not in response:
        return {'msg': 'User does not exist!'}, 400

    user = response['Item']
    if not check_password_hash(user['password'], password):
        return {'msg': 'Invalid credentials!'}, 400

    return {'msg': 'Correct Credentials', 'username': response['Item']['username'], 'email': response['Item']['email']}, 200

def get_user(email):
    table = current_app.database.Table('LeasyUsers')
    response = table.get_item(
        Key={
            'email': email
        }
    )
    if 'Item' not in response:
        return {'msg': 'User does not exist!'}, 400

    return {'username': response['Item']['username'], 'email': response['Item']['email']}, 200

def logout_user(email, jti):
    table = current_app.database.Table('LeasyUsers')
    response = table.get_item(
        Key={
            'email': email
        }
    )
    if 'Item' not in response:
        return {'msg': 'User does not exist!'}, 400

    user = response['Item']
    if 'revoked_tokens' not in user:
        user['revoked_tokens'] = []

    user['revoked_tokens'].append(jti)
    table.put_item(Item=user)

    return {'msg': 'Token revoked successfully!'}, 200

def is_token_revoked(jti, email):
    table = current_app.database.Table('LeasyUsers')
    response = table.get_item(
        Key={
            'email': email
        }
    )
    if 'Item' not in response:
        return True

    user = response['Item']
    if 'revoked_tokens' not in user:
        return False

    return jti in user['revoked_tokens']