import json
import os
import pandas as pd
import numpy as np
import boto3


def create_dataframe(listings):
    
    address, zipcode, state, university, price, roomtype, bathroomtype, description, amenities, leaseTerm, images = [],[],[],[],[],[],[],[],[],[],[]

    for listing in listings:
        address.append(listing['address'])
        zipcode.append(listing['zipcode'])
        state.append(listing['stateName'])
        university.append(listing['university'])
        price.append(listing['price'])
        roomtype.append(listing['roomtype'])
        bathroomtype.append(listing['bathroomtype'])
        description.append(listing['description'])
        amenities.append(','.join(w for w in listing['amenities']))
        images.append(listing['images'])

    df = {
        "address": address,
        "zipcode": zipcode,
        "state": state,
        "university": university,
        "price": price,
        "roomtype": roomtype,
        "bathroomtype": bathroomtype,
        "description": description,
        "amenities": amenities,
        "images": images
    }
    
    return df

def sns_publish(message):
    client = boto3.client('sns')
    response = client.publish(
        TargetArn=os.environ['SNS_TOPIC_ARN'],
        Message= message,
    )

def get_mapping():
    us_state_to_abbrev = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
    "District of Columbia": "DC",
    "American Samoa": "AS",
    "Guam": "GU",
    "Northern Mariana Islands": "MP",
    "Puerto Rico": "PR",
    "United States Minor Outlying Islands": "UM",
    "U.S. Virgin Islands": "VI",
    }
    return us_state_to_abbrev