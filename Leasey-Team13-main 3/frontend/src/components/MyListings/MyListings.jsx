import { Navigate, useLocation, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./MyListings.css";
import { deleteListing, getUserListings } from "../../requests";

const MyListings = (props) => {
    const location = useLocation();
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await getUserListings(
                sessionStorage.getItem("access_token")
            );
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!props.user) {
        return (
            <Navigate to={"/login"} replace state={{ redirectTo: location }} />
        );
    }

    const token = sessionStorage.getItem("access_token");
    return (
        <div className="wrapper">
            {data?.length ? (
                data.map((item) => <Card {...item} />)
            ) : (
                <div>No listings found</div>
            )}
        </div>
    );
};

function Card(props) {
    const navigate = useNavigate();
    const getImage = (image) => {
        const isHttpLink = image.startsWith("http");
        if (isHttpLink) {
            return image;
        }
        return "https://leasey-images.s3.amazonaws.com/" + image;
    };

    return (
        <Link className="card" to={`/house_overview/${props.objectId}`}>
            <div className="card-body">
                <img
                    src={getImage(props.images[0])}
                    className="card-image"
                    alt="house"
                />
                <div className="card-address">{props.address}</div>
                <div className="card-type">
                    {props.roomtype} | {`$ ${props.price}`}
                </div>
                <div className="card-edit">
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/edit_listing/${props.objectId}`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={async () => {
                            if (
                                window.confirm(
                                    "Are you sure you want to delete this listing?"
                                )
                            ) {
                                await deleteListing(
                                    props.objectId,
                                    sessionStorage.getItem("access_token")
                                );
                                navigate("/my_listings");
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Link>
    );
}

export default MyListings;
