import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { State } from "country-state-city";
import { TextField, MenuItem } from "@mui/material";
import "./LeaseForm.css";
import { getStateAnalysis, getUniversityAnalysis, getExistingStateRent } from "../../requests";

const AnalysisPage = () => {
    const universities = require("../assets/us_universities.json");

    const [analysisData, setAnalysisData] = useState({});
    const [statePrice, setStatePrice] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [universityPrice, setUniversityPrice] = useState([]);
    const [stateroomtype, setstateroomType] = useState([]);
    const [univroomtype, setunivroomType] = useState([]);
    const [stateroomtyperent, setstateroomtypeRent] = useState([]);
    const [univroomtyperent, setunivroomtypeRent] = useState([]);
    React.useEffect(() => {
        fetch("http://3.81.123.142:8080/analysis")
            .then((response) => response.json())
            .then((data) => setAnalysisData(data.data))
            .catch((error) => console.log(error));
    }, []);

    const [avgSharedPrice, setAvgSharedPrice] = useState(0);
    const [avgPrivatePrice, setAvgPrivatePrice] = useState(0);
    const [sharedRoomCount, setSharedRoomCount] = useState(0);
    const [privateRoomCount, setPrivateRoomCount] = useState(0);
    const [totalRoomCount, setTotalRoomCount] = useState(0);

    const [univAvgSharedPrice, setUnivAvgSharedPrice] = useState(0);
    const [univAvgPrivatePrice, setUnivAvgPrivatePrice] = useState(0);
    const [univSharedRoomCount, setUnivSharedRoomCount] = useState(0);
    const [univPrivateRoomCount, setUnivPrivateRoomCount] = useState(0);
    const [univTotalCount, setUnivTotalCount] = useState(0);
    const [existingStatePrivate, setExistingStatePrivate] = useState(0);
    const [existingStateShared, setExistingStateShared] = useState(0);

    const price = analysisData.price;
    const state = analysisData.state;
    const leaseterm = analysisData.leaseTerm;
    const roomtype = analysisData.roomtype;
    const university = analysisData.university;

    const getPriceByState = (event) => {
        //const selectedState = event.target.value;
        const tempstate = event.target.value;
        setSelectedState(tempstate);
        console.log(tempstate);

        const temp = [];
        const temp1 = [];
        const temp2 = [];
        console.log("LEASE TERM", leaseterm);
        // Loop through the arrays and filter prices for the selected state
        state.forEach((s, index) => {
            if (s === tempstate) {
                temp.push(price[index]);

                temp1.push(roomtype[index]);
                temp2.push(price[index]);
            }
        });

        setstateroomtypeRent(temp2);
        setstateroomType(temp1);
        setStatePrice(temp);
    };

    const getPriceByUniversity = (event) => {
        //const selectedState = event.target.value;
        const tempuniv = event.target.value;
        setSelectedUniversity(tempuniv);
        console.log(tempuniv);

        const temp = [];
        const temp1 = [];
        const temp2 = [];
        // Loop through the arrays and filter prices for the selected state
        university.forEach((s, index) => {
            if (s === tempuniv) {
                temp.push(price[index]);

                temp1.push(roomtype[index]);
                temp2.push(price[index]);
            }
        });
        setunivroomType(temp1);
        setunivroomtypeRent(temp2);
        setUniversityPrice(temp);
    };

    const handleSubmit = () => {
        console.log("Submitted");
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await getStateAnalysis(selectedState);
            if (!response) {
                setAvgPrivatePrice(0);
                setAvgSharedPrice(0);
                setPrivateRoomCount(0);
                setSharedRoomCount(0);
                setTotalRoomCount(0);
            } else {
                const data = response.data;
                setAvgPrivatePrice(data["Avg_Private_Room_Rent"]);
                setAvgSharedPrice(data["Avg_Shared_Room_Rent"]);
                setSharedRoomCount(data["#SharedRooms"]);
                setPrivateRoomCount(data["#PrivateRooms"]);
                setTotalRoomCount(data["totalCount"]);
            }
        };
        fetchData();
    }, [selectedState]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getUniversityAnalysis(selectedUniversity);
            if (!response) {
                setUnivAvgPrivatePrice(0);
                setUnivAvgSharedPrice(0);
                setUnivPrivateRoomCount(0);
                setUnivSharedRoomCount(0);
                setUnivTotalCount(0);
            } else {
                const data = response.data;
                setUnivAvgPrivatePrice(data["Avg_Private_Room_Rent"]);
                setUnivAvgSharedPrice(data["Avg_Shared_Room_Rent"]);
                setUnivSharedRoomCount(data["#SharedRooms"]);
                setUnivPrivateRoomCount(data["#PrivateRooms"]);
                setUnivTotalCount(data["totalCount"]);
            }
        };
        fetchData();
    }, [selectedUniversity]);

    useEffect(() => {
        const fetchData = async () => {
            console.log("USING EXISTING DATA");
            const response = await getExistingStateRent(selectedState);
            if (!response) {
                setExistingStatePrivate(0);
                setExistingStateShared(0);
            } else {
                const data = response.data;
                setExistingStatePrivate(data['private_rent']);
                setExistingStateShared(data['shared_rent']);
            }
        }
        fetchData();
        console.log("Existing State Private Rent: ", existingStatePrivate);
        console.log("Existing State Shared Rent: ", existingStateShared);
    }, [selectedState]);

    return (
        <div className="plotdiv">
            <div style={{ textAlign: "center" }}>
                <h1>Rent Statistics in Selected State</h1>
            </div>

            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-row">
                    <TextField
                        label="State"
                        className="form-input"
                        select
                        onChange={getPriceByState}
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
                </div>
            </form>
            {/* Plot no 1 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Plot
                    data={[
                        {
                            type: "box",
                            y: statePrice, // Convert prices to numbers
                            boxpoints: "all", // Display all data points
                            jitter: 0.3, // Jitter factor
                            pointpos: -1.8, // Point position
                            marker: {
                                color: "rgb(7,40,89)", // Marker color
                                opacity: 0.5, // Marker opacity
                                size: 5, // Marker size
                            },
                        },
                    ]}
                    layout={{
                        width: "50%",
                        height: 400,
                        title: "Rent Distribution for " + selectedState,
                        yaxis: {
                            title: "Rent",
                        },
                        margin: {
                            l: 60,
                            r: 10,
                            t: 60,
                            b: 40,
                        },
                    }}
                />
            </div>
            {/* Plot no 2 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Plot
                    data={[
                        {
                            type: "box",
                            x: stateroomtype,
                            y: stateroomtyperent, // Convert prices to numbers
                            boxpoints: "all", // Display all data points
                            jitter: 0.3, // Jitter factor
                            pointpos: -1.8, // Point position
                            marker: {
                                color: "rgb(7,40,89)", // Marker color
                                opacity: 0.5, // Marker opacity
                                size: 5, // Marker size
                            },
                        },
                    ]}
                    layout={{
                        width: "50%",
                        height: 400,
                        title:
                            "Rent Distribution for " +
                            selectedState +
                            " by Room Type",
                        xaxis: {
                            title: "Room Type",
                        },
                        yaxis: {
                            title: "Rent",
                        },
                        margin: {
                            l: 60,
                            r: 10,
                            t: 60,
                            b: 40,
                        },
                    }}
                />
            </div>
            {/* Plot no 3 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Plot
                    data={[
                        {
                            type: "histogram",
                            opacity: 0.5,
                            x: statePrice, // Convert prices to numbers
                            marker: {
                                color: "rgb(7,40,89)", // Marker color
                                line: {
                                    color: "black", // Border color
                                    width: 3,
                                    opacity: 1, // Border width
                                },
                            },
                        },
                    ]}
                    layout={{
                        width: 800,
                        height: 400,
                        title: "Histogram of Rent Values in " + selectedState,
                        xaxis: { title: "Values" },
                        yaxis: { title: "Frequency" },
                    }}
                />
            </div>
            <div style={{ textAlign: "center" }}>
                <p>
                    There are <b>{totalRoomCount}</b> apartments available for
                    sublease in <b>{selectedState}</b> of which{" "}
                    <b>{privateRoomCount}</b> apartments are offering a Private
                    Bedroom and <b>{sharedRoomCount}</b> apartments are offering
                    a Shared Bedroom.

                </p>
                <p>
                    In {selectedState}, the average rent for a Private Room is $
                    {avgPrivatePrice} and the average rent for a Shared Room is
                    ${avgSharedPrice}
                </p>
                <p>
                    Historical rent statistics in {selectedState}: <br></br>
                    - The Private Room rent was ${existingStatePrivate} and Shared Room rent was ${existingStateShared}
                </p>
            </div>
            {/* Plot no 4 */}

            <div style={{ textAlign: "center" }}>
                <h1>Rent Statistics in Selected University</h1>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-row">
                    <TextField
                        required
                        label="University"
                        className="form-input"
                        select
                        onChange={getPriceByUniversity}
                    >
                        {universities[selectedState]
                            .sort()
                            .map((university, index) => (
                                <MenuItem key={university} value={university}>
                                    {university}
                                </MenuItem>
                            ))}
                    </TextField>
                </div>
            </form>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Plot
                    data={[
                        {
                            type: "box",
                            y: universityPrice, // Convert prices to numbers
                            boxpoints: "all", // Display all data points
                            jitter: 0.3, // Jitter factor
                            pointpos: -1.8, // Point position
                            marker: {
                                color: "rgb(7,40,89)", // Marker color
                                opacity: 0.5, // Marker opacity
                                size: 5, // Marker size
                            },
                        },
                    ]}
                    layout={{
                        width: 800,
                        height: 400,
                        title: "Rent Distribution for " + selectedUniversity,
                        yaxis: {
                            title: "Rent",
                        },
                        margin: {
                            l: 60,
                            r: 10,
                            t: 60,
                            b: 40,
                        },
                    }}
                />
            </div>
            {/* Plot no 5 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Plot
                    data={[
                        {
                            type: "box",
                            x: univroomtype,
                            y: univroomtyperent, // Convert prices to numbers
                            boxpoints: "all", // Display all data points
                            jitter: 0.3, // Jitter factor
                            pointpos: -1.8, // Point position
                            marker: {
                                color: "rgb(7,40,89)", // Marker color
                                opacity: 0.5, // Marker opacity
                                size: 5, // Marker size
                            },
                        },
                    ]}
                    layout={{
                        width: 800,
                        height: 400,
                        title:
                            "Rent Distribution for " +
                            selectedUniversity +
                            " by Room Type",
                        yaxis: {
                            title: "Rent",
                        },
                        xaxis: {
                            title: "Room Type",
                        },
                        margin: {
                            l: 60,
                            r: 10,
                            t: 60,
                            b: 40,
                        },
                    }}
                />
            </div>
            {/* Plot no 6 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Plot
                    data={[
                        {
                            type: "histogram",
                            opacity: 0.5,
                            x: universityPrice, // Convert prices to numbers
                            marker: {
                                color: "rgb(7,40,89)", // Marker color
                                line: {
                                    color: "black", // Border color
                                    width: 3,
                                    opacity: 1, // Border width
                                },
                            },
                        },
                    ]}
                    layout={{
                        width: 800,
                        height: 400,
                        title:
                            "Histogram of Rent Values in " + selectedUniversity,
                        xaxis: { title: "Values" },
                        yaxis: { title: "Frequency" },
                    }}
                />
            </div>
            <div style={{ textAlign: "center" }}>
                <p>
                    There are <b>{univTotalCount}</b> apartments available for
                    sublease in <b>{selectedUniversity}</b> of which{" "}
                    <b>{univPrivateRoomCount}</b> apartments are offering a
                    Private Bedroom and <b>{univSharedRoomCount}</b> apartments
                    are offering a Shared Bedroom.
                </p>
                <p>
                    Near {selectedUniversity}, the average rent for a Private
                    Room is ${univAvgPrivatePrice} and the average rent for a
                    Shared Room is ${univAvgSharedPrice}
                </p>
            </div>
        </div>
    );
};

export default AnalysisPage;
