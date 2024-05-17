from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, current_user, get_jwt
from werkzeug.security import generate_password_hash
from datetime import timedelta
import aws_controller

auth_bp = Blueprint('auth', __name__)

@auth_bp.post('/register')
def register_user():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    hashed_password = generate_password_hash(password)
    response, status_code = aws_controller.create_user(email, username, hashed_password)
    return jsonify(response), status_code

@auth_bp.post('/login')
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    response, status_code = aws_controller.login_user(email, password)

    if status_code == 200:
        access_token = create_access_token(identity=email, expires_delta=timedelta(hours=1))
        return jsonify({
            'username': response['username'],
            'email': response['email'],
            'access_token': access_token
        }), 200
    else:
        return jsonify(response), status_code
    
@auth_bp.get('/get-user')
@jwt_required()
def get_user():
    response = aws_controller.get_user(current_user['email'])
    return jsonify(response), 200

@auth_bp.get('/logout')
@jwt_required()
def logout_user():
    jti = get_jwt()['jti']
    response = aws_controller.logout_user(current_user['email'], jti)
    return jsonify(response), 200

@auth_bp.post('/signup')
def signup():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    hashed_password = generate_password_hash(password)
    response, status_code = aws_controller.create_user(email, username, hashed_password)
    return jsonify(response), status_code