from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import make_response
from auth import auth_bp
from listings import listings_bp
from flask_jwt_extended import JWTManager, current_user, jwt_required
from dotenv import load_dotenv
from botocore.exceptions import ClientError
import aws_controller
import boto3
import json
from helper_funcs import create_dataframe



load_dotenv()

# s3 = boto3.resource(
#     service_name='s3',
#     region_name='us-east-2',
#     aws_access_key_id=os.environ['AWS_ACCESS_KEY'],
#     aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
# )

# print("Connected with s3 bucket")


def get_secret():
    secret_name = "JWT_SECRET_KEY"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e
    
    secret = get_secret_value_response['SecretString']
    secret = json.loads(secret)
    return secret["JWT_SECRET_KEY"]


def create_app(database, secret):
    app = Flask(__name__)
    load_dotenv()
    app.config["JWT_SECRET_KEY"] = secret
    CORS(app, resources={r"*": {"origins": "*"}})

    jwt = JWTManager(app)
    app.database = database

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return {"email": identity}
    
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        jti = jwt_payload['jti']
        email = jwt_payload['sub']
        return aws_controller.is_token_revoked(jti, email)

    # Register the blueprint
    app.register_blueprint(auth_bp)
    CORS(auth_bp, resources={r"*": {"origins": "*"}})
    app.register_blueprint(listings_bp)
    CORS(listings_bp, resources={r"*": {"origins": "*"}})
    return app

secret_key = get_secret()
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

table = dynamodb.Table('LeasyUsers')
listings_table = dynamodb.Table('listings')
app = create_app(dynamodb, secret_key)
print("Connect")
s3 = boto3.resource('s3', region_name='us-east-1')


@app.route('/', methods=['GET'])
def hello():
    name = request.args.get('name')
    email = request.args.get('email')

    # Your code here

    response = make_response({"data" : "Hello, " + name + "!!!, " + "Your email is " + email})
    response.status_code = 200
    return response



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
