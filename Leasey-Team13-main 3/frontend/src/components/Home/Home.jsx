import React, { useState } from "react";
import SearchForm from "../SearchForm/SearchForm";
import Cards from "../Cards/cards";
import { Pagination } from "@mui/material";

const Home = (props) => {
    const [pageNumber, setPageNumber] = useState(1);
    const pageCount = 15;

    const handlePageChange = (event, value) => {
        setPageNumber(value);
    };

    const getPageCount = () => {
        return Math.ceil(props.searchResults.length / pageCount);
    };

    return (
        <div>
            <SearchForm
                setSearchFilter={props.setSearchFilter}
                searchFilter={props.searchFilter}
                resetFilter={props.resetFilter}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "50px",
                }}
            >
                <Pagination
                    count={getPageCount()}
                    color="primary"
                    onChange={handlePageChange}
                />
            </div>
            <Cards
                searchResults={props.searchResults}
                pageNumber={pageNumber}
            />
        </div>
    );
};

export default Home;
