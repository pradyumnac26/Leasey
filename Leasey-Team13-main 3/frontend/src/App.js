import "./App.css";
import Home from "./components/Home/Home";
import Login from "./components/LoginSignup/Login";
import Signup from "./components/LoginSignup/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import { useEffect, useState } from "react";
import { getAllListings, getUser } from "./requests";
import MyListings from "./components/MyListings/MyListings";
import CreateListings from "./components/CreateListings/CreateListings";
import { ListProvider } from "./components/context/ListingContext";

import EditLeaseForm from "./components/EditLeaseForm/EditLeaseForm";
import AnalysisPage from "./components/AnalysisPage/AnalysisPage";

import HouseOverview from "./components/HouseOverview/HouseOverview";
import SupportEngine from "./components/SupportEngine";
import SupportAdmin from "./components/SupportAdmin";

function App() {
    const [user, setUser] = useState(null);
    const token = sessionStorage.getItem("access_token");
    const [listings, setListings] = useState([]);
    const [searchFilter, setSearchFilter] = useState({});
    const [searchResults, setSearchResults] = useState(
        listings ? listings : []
    );

    useState(() => {
        if (token && !user) {
            getUser(token)
                .then((data) => {
                    setUser(data[0]);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllListings();
                console.log(response.data);
                setListings(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const results = listings.filter((listing) => {
            for (const key in searchFilter) {
                if (searchFilter[key] !== "" && searchFilter[key] !== null) {
                    if (key === "moveInDate" && searchFilter["moveInDate"]) {
                        if (
                            new Date(listing["startDate"]) >
                            new Date(searchFilter["moveInDate"])
                        ) {
                            return false;
                        }
                    } else if (
                        key === "moveOutDate" &&
                        searchFilter["moveOutDate"]
                    ) {
                        if (
                            new Date(listing["endDate"]) <
                            new Date(searchFilter["moveOutDate"])
                        ) {
                            return false;
                        }
                    } else if (key === "minPrice") {
                        if (
                            Number(listing["price"]) <
                            Number(searchFilter["minPrice"])
                        ) {
                            return false;
                        }
                    } else if (key === "maxPrice") {
                        if (
                            Number(listing["price"]) >
                            Number(searchFilter["maxPrice"])
                        ) {
                            return false;
                        }
                    } else if (
                        listing[key] &&
                        listing[key] !== searchFilter[key]
                    ) {
                        return false;
                    }
                }
            }
            return true;
        });
        setSearchResults(results);
    }, [searchFilter, listings]);

    const resetFilter = () => {
        setSearchFilter({});
    };

    const getListingById = (id) => {
        return listings.find((listing) => listing.objectId === id);
    };

    return (
        <>
            <Router>
                <ListProvider>
                    <NavBar user={user} setUser={setUser} />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home
                                    user={user}
                                    searchResults={searchResults}
                                    setSearchFilter={setSearchFilter}
                                    searchFilter={searchFilter}
                                    resetFilter={resetFilter}
                                />
                            }
                        />
                        <Route
                            path="/login"
                            element={<Login user={user} setUser={setUser} />}
                        />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/create_listing"
                            element={
                                <CreateListings
                                    user={user}
                                    setListings={setListings}
                                />
                            }
                        />
                        <Route
                            path="/my_listings"
                            element={<MyListings user={user} />}
                        />
                        <Route
                            path="/edit_listing/:id"
                            element={
                                <EditLeaseForm
                                    user={user}
                                    getListingById={getListingById}
                                />
                            }
                        />
                        <Route
                            path="/house_overview/:id"
                            element={
                                <HouseOverview
                                    user={user}
                                    getListingById={getListingById}
                                />
                            }
                        />

                        <Route
                            path="/analysis"
                            element={<AnalysisPage user={user} />}
                        />
                        <Route
                            path="*"
                            element={
                                <div className="App-404">
                                    <h1>404 Not Found</h1>
                                </div>
                            }
                        />
                        <Route path="/support" element={<SupportAdmin />} />
                    </Routes>
                </ListProvider>
            </Router>
        </>
    );
}

export default App;
