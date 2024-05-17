import React from "react";
import { Alert } from "@mui/material";

const AlertBanner = (props) => {
    if (props.errorMessage.length === 0) return null;
    return (
        <Alert
            severity="error"
            onClose={() => {
                props.setErrorMessage("");
            }}
            style={{
                marginTop: "1rem",
                marginLeft: "1rem",
                marginRight: "1rem",
            }}
        >
            {props.errorMessage}
        </Alert>
    );
};

export default AlertBanner;
