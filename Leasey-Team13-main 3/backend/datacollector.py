import requests
from helper_funcs import get_mapping
import uuid
import boto3
from decimal import Decimal

dynamodb_client = boto3.resource('dynamodb')
existing_listings_table = dynamodb_client.Table('existing_listings_rent')

def data_collector(stateName):
    API_KEY = "6c415d3f85754ca0b29b03e8abb4d4b3"

    state_code = get_mapping()[stateName]

    url = f"https://api.rentcast.io/v1/listings/rental/long-term?state={state_code}&status=Active&limit=100"

    headers = {"accept": "application/json",
               "X-API-Key": API_KEY}

    response = requests.get(url, headers=headers)

    data = response.json()


    private_rent_total = 0

    c = 0
    for listing in data:
        try:
            rent = round(listing['price']/listing['bedrooms'], 2)
            private_rent_total += rent
            c += 1
        except:
            pass

    print("RENT", private_rent_total)
    avg_private_rent = Decimal(str(round(private_rent_total / c, 2)))
    avg_shared_rent = Decimal(str(round(private_rent_total / (2*c), 2)))
    
    obj = {
        'objectId':  stateName,
        'private_rent': avg_private_rent,
        'shared_rent': avg_shared_rent,
    }


    existing_listings_table.put_item(
        Item=obj
    )

    return stateName


