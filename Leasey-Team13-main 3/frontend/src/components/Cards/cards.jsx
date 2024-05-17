import React from "react";
import "./cards.css";
import { Link } from "react-router-dom";

const Cards = (props) => {
    const data = props.searchResults;
    console.log(props.pageNumber);

    const listings = [];
    for (let i = (props.pageNumber - 1) * 15; i < props.pageNumber * 15; i++) {
        if (props.searchResults[i]) {
            listings.push(props.searchResults[i]);
        }
    }

    return (
        <div className="wrapper">
            {listings?.length ? (
                listings.map((item) => <Card {...item} />)
            ) : (
                <div>No listings found</div>
            )}
        </div>
    );
};

function Card(props) {
    const getImage = (image) => {
        const isHttpLink = image.startsWith("http");
        if (isHttpLink) {
            return image;
        }
        return "https://leasey-images.s3.amazonaws.com/" + image;
    };

    return (
        <Link className="card" to={`house_overview/${props.objectId}`}>
            <div className="card-body">
                <img
                    src={getImage(props.images[0])}
                    className="card-image"
                    alt="house"
                />
                <div className="card-title"> {props.name}</div>
                <div className="card-address">{props.address}</div>
                <div className="card-type">
                    {props.roomtype} | {`$ ${props.price}`}
                </div>
            </div>
        </Link>
    );
}
export default Cards;
