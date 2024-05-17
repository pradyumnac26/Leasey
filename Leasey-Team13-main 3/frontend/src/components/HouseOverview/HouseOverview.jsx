import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./HouseOverview.css";
import Slider from "react-slick";
import { Button } from "@mui/material";
import { deleteListing } from "../../requests";
import SupportEngine from "../SupportEngine"; // Make sure to import the SupportEngine

const HouseOverview = (props) => {
    const [chatVisible, setChatVisible] = useState(false); // State to manage chat visibility
    const params = useParams();
    const listing = props.getListingById(params.id);
    const navigate = useNavigate();

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    var functionalities = [
        { name: "Edit", by: "owner" },
        { name: "Delete", by: "owner" },
    ];

    const getImage = (image) => {
        const isHttpLink = image.startsWith("http");
        if (isHttpLink) {
            return image;
        }
        return "https://leasey-images.s3.amazonaws.com/" + image;
    };

    const getListingOverView = () => {
        return (
            <div>
                <div className="carousel">
                    <Slider {...settings}>
                        {listing.images.map((image, index) => (
                            <img
                                key={index}
                                src={getImage(image)}
                                alt="house"
                                width={500}
                                height={500}
                            />
                        ))}
                    </Slider>
                </div>
                <h1 className="listing-address">{listing.address}</h1>
                <div className="table-container">
                    <table>
                        {[
                            { label: "Zip Code:", value: listing.zipcode },
                            { label: "State:", value: listing.stateName },
                            { label: "University:", value: listing.university },
                            { label: "Price:", value: `$${listing.price}` },
                            { label: "Room Type:", value: listing.roomtype },
                            {
                                label: "Bathroom Type:",
                                value: listing.bathroomtype,
                            },
                            {
                                label: "Description:",
                                value: listing.description,
                            },
                            { label: "Start Date:", value: listing.startDate },
                            { label: "End Date:", value: listing.endDate },
                            {
                                label: "Amenities:",
                                value: JSON.parse(listing.amenities),
                            },
                            { label: "Owner Name:", value: listing.userName },
                            { label: "Owner Email:", value: listing.email },
                        ].map((item, index) => (
                            <tr key={index}>
                                <td>{item.label}</td>
                                <td>{item.value}</td>
                            </tr>
                        ))}
                    </table>
                </div>
                <div className="functions">
                    {props.user ? (
                        functionalities
                            .filter((functionality) =>
                                props.user.email === listing.email
                                    ? functionality.by === "owner"
                                    : functionality.by === "others"
                            )
                            .map((functionality) => (
                                <Button
                                    variant="contained"
                                    key={functionality.name}
                                    color={
                                        functionality.name === "Edit"
                                            ? "primary"
                                            : "error"
                                    }
                                    onClick={() => {
                                        if (functionality.name === "Chat") {
                                            setChatVisible(true); // Show the chat window
                                        } else if (
                                            functionality.name === "Edit"
                                        ) {
                                            navigate(
                                                `/edit_listing/${listing.objectId}`
                                            );
                                        } else if (
                                            functionality.name === "Delete"
                                        ) {
                                            if (
                                                window.confirm(
                                                    "Are you sure you want to delete this listing?"
                                                )
                                            ) {
                                                deleteListing(
                                                    listing.objectId,
                                                    sessionStorage.getItem(
                                                        "access_token"
                                                    )
                                                );
                                                navigate("/my_listings");
                                            }
                                        }
                                    }}
                                >
                                    {functionality.name}
                                </Button>
                            ))
                    ) : (
                        <p>Login to chat</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <SupportEngine
                isVisible={chatVisible}
                setVisible={setChatVisible}
                user={props.user}
            />
            {listing ? getListingOverView() : <div>Listing not found</div>}
        </div>
    );
};

export default HouseOverview;
