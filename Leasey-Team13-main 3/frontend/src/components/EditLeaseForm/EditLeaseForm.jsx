import React, { useEffect, useState } from "react";
import "./LeaseForm.css";
import {
    TextField,
    Button,
    MenuItem,
    Select,
    Checkbox,
    ListItemText,
} from "@mui/material";
import { State } from "country-state-city";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { editLisitng } from "../../requests";

const EditLeaseForm = (props) => {
    const params = useParams();
    const currListing = props.getListingById(params.id);

    const universities = require("../assets/us_universities.json");
    const [address, setAddress] = useState("");
    const [zipcode, setZipCode] = useState("");
    const [stateName, setStateName] = useState("");
    const [university, setUniversity] = useState("");
    const [price, setPrice] = useState("");
    const [roomtype, setRoomType] = useState("");
    const [bathroomtype, setBathroomType] = useState("");
    const [description, setdescription] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (!currListing) return;

        console.log("CURR LISTING", currListing, currListing.address);
        setAddress(currListing.address);
        setZipCode(currListing.zipcode);
        setStateName(currListing.stateName);
        setUniversity(currListing.university);
        setPrice(currListing.price);
        setRoomType(currListing.roomtype);
        setBathroomType(currListing.bathroomtype);
        setdescription(currListing.description);
        setAmenities(JSON.parse(currListing.amenities));
        setStartDate(currListing.startDate);
        setEndDate(currListing.endDate);
    }, [currListing]);

    const listOfAmenities = [
        "Gym",
        "Pool",
        "WiFi",
        "Parking",
        "Laundry",
        "Balcony",
        "AC",
        "Heater",
        "Clubhouse",
        "Rooftop",
        "Lawn",
        "Park",
        "Playground",
        "Trash",
        "Elevator",
        "Security Guard",
    ];

    let history = useNavigate();

    const handleAmenitiesChange = (event) => {
        console.log("STATE", stateName);
        console.log("UNIVERSITY", university[stateName]);
        const {
            target: { value },
        } = event;
        setAmenities(typeof value === "string" ? value.split(",") : value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("address", address);
        formData.append("zipcode", zipcode);
        formData.append("stateName", stateName);
        formData.append("university", university);
        formData.append("price", price);
        formData.append("roomtype", roomtype);
        formData.append("bathroomtype", bathroomtype);
        formData.append("description", description);
        formData.append("amenities", JSON.stringify(amenities));
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("id", params.id);

        console.log(formData);
        const response = await editLisitng(
            formData,
            sessionStorage.getItem("access_token")
        );

        if (response.status === 200) history("/my_listings");
    };

    return (
        <div>
            <h2 className="title">Cannot Update Images</h2>
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-row">
                    <TextField
                        label="Address"
                        className="form-input"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <TextField
                        label="Zip Code"
                        className="form-input"
                        type="number"
                        value={zipcode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                    />
                </div>

                <div className="form-row">
                    <TextField
                        label="State"
                        className="form-input"
                        select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        required
                    >
                        {State.getStatesOfCountry("US").map((statename) => (
                            <MenuItem
                                key={statename.name}
                                value={statename.name}
                            >
                                {statename.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        required
                        label="University"
                        className="form-input"
                        select
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                    >
                        {universities[stateName]
                            .sort()
                            .map((university, index) => (
                                <MenuItem key={university} value={university}>
                                    {university}
                                </MenuItem>
                            ))}
                    </TextField>
                </div>
                <div className="form-row">
                    <TextField
                        required
                        type="number"
                        label="Rent (per month)"
                        className="form-input"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        InputProps={{
                            inputProps: {
                                min: 0,
                            },
                        }}
                    />

                    <div className="form-row">
                        <div className="date-row">
                            <label htmlFor="moveInDate">Start Date</label>
                            <TextField
                                type="date"
                                name="startDate"
                                className="form-input"
                                value={startDate}
                                required
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="date-row">
                            <label htmlFor="moveOut">End Date</label>
                            <TextField
                                type="date"
                                name="endDate"
                                className="form-input"
                                value={endDate}
                                required
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <TextField
                        required
                        label="RoomType"
                        className="form-input"
                        select
                        value={roomtype}
                        onChange={(e) => setRoomType(e.target.value)}
                    >
                        <MenuItem value={"Shared"}>Shared</MenuItem>
                        <MenuItem value={"Private"}>Private</MenuItem>
                    </TextField>
                    <TextField
                        required
                        label="Bathroom"
                        className="form-input"
                        select
                        value={bathroomtype}
                        onChange={(e) => setBathroomType(e.target.value)}
                    >
                        <MenuItem value={"Attached"}>Attached</MenuItem>
                        <MenuItem value={"Common"}>Common</MenuItem>
                    </TextField>
                </div>
                <div className="form-row">
                    <TextField
                        required
                        type="text"
                        label="Description"
                        className="form-input"
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                        rows={4}
                    ></TextField>
                    <Select
                        required
                        multiple
                        label="Amenities"
                        className="form-input"
                        onChange={handleAmenitiesChange}
                        renderValue={(selected) => selected.join(", ")}
                        value={amenities}
                    >
                        {listOfAmenities.map((amenity) => (
                            <MenuItem key={amenity} value={amenity}>
                                <Checkbox
                                    checked={amenities.indexOf(amenity) > -1}
                                />
                                <ListItemText primary={amenity} />
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <Button
                    type="submit"
                    className="submit-button"
                    variant="contained"
                >
                    Update
                </Button>
            </form>
        </div>
    );
};

export default EditLeaseForm;
