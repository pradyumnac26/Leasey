import { useState } from "react";
import "./SearchForm.css";
import { TextField, Button, MenuItem } from "@mui/material";
import { State } from "country-state-city";

const SearchForm = (props) => {
    const [stateName, setStateName] = useState("");
    const [university, setUniversity] = useState("");
    const [roomType, setRoomType] = useState("");
    const [bathroomType, setBathroomType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("10000");
    const [moveInDate, setMoveInDate] = useState("");
    const [moveOutDate, setMoveOutDate] = useState("");

    const universities = require("../assets/us_universities.json");
    const handleSearch = (e) => {
        e.preventDefault();
        const searchFilter = {
            stateName: stateName,
            university: university,
            roomtype: roomType,
            bathroomType: bathroomType,
            minPrice: Number(minPrice),
            maxPrice: Number(maxPrice),
            moveInDate: new Date(moveInDate),
            moveOutDate: new Date(moveOutDate),
        };
        props.setSearchFilter(searchFilter);
    };

    const handleReset = (e) => {
        e.preventDefault();
        setStateName("");
        setUniversity("");
        setRoomType("");
        setBathroomType("");
        setMinPrice("");
        setMaxPrice("10000");
        setMoveInDate("");
        setMoveOutDate("");
        props.resetFilter();
    };

    return (
        <div>
            <form className="form-container" onSubmit={handleSearch}>
                <div className="form-row">
                    <TextField
                        label="State"
                        className="form-input"
                        select
                        value={stateName}
                        required
                        onChange={(e) => {
                            setStateName(e.target.value);
                        }}
                    >
                        {State.getStatesOfCountry("US").map((state) => (
                            <MenuItem key={state.name} value={state.name}>
                                {state.name}
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
                        label="RoomType"
                        className="form-input"
                        select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                    >
                        <MenuItem value={"Shared"}>Shared</MenuItem>
                        <MenuItem value={"Private"}>Private</MenuItem>
                    </TextField>
                    <TextField
                        label="Bathroom"
                        className="form-input"
                        select
                        value={bathroomType}
                        onChange={(e) => setBathroomType(e.target.value)}
                    >
                        <MenuItem value={"Attached"}>Attached</MenuItem>
                        <MenuItem value={"Common"}>Common</MenuItem>
                    </TextField>
                </div>
                <div className="form-row">
                    <div className="date-row">
                        <label htmlFor="moveInDate">Move In Date</label>
                        <TextField
                            type="date"
                            name="moveInDate"
                            className="form-input"
                            value={moveInDate}
                            required
                            onChange={(e) => setMoveInDate(e.target.value)}
                        />
                    </div>
                    <div className="date-row">
                        <label htmlFor="moveOut">Move Out Date</label>
                        <TextField
                            type="date"
                            name="moveOutDate"
                            className="form-input"
                            value={moveOutDate}
                            required
                            onChange={(e) => setMoveOutDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <TextField
                        type="number"
                        label="Min Price ($)"
                        className="form-input"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <TextField
                        type="number"
                        label="Max Price ($)"
                        className="form-input"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="button-row">
                    <Button
                        variant="contained"
                        className="submit-button"
                        type="submit"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>

                    <Button
                        variant="contained"
                        className="submit-button"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SearchForm;
