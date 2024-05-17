import React, { useState } from "react";
import "./LoginSignup.css";

import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../requests";
import AlertBanner from "../AlertBanner/AlertBanner";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const { state: locationState } = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(email, password)
            .then((res) => {
                sessionStorage.setItem("access_token", res.access_token);
                props.setUser({ email: res.email, username: res.username });
                if (locationState) {
                    const { redirectTo } = locationState;
                    navigate(`${redirectTo.pathname}${redirectTo.search}`);
                } else {
                    navigate("/");
                }
            })
            .catch((err) => {
                setErrorMessage(err.response.data.msg);
            });
    };

    const getLoginForm = () => {
        return (
            <>
                <AlertBanner
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />
                <form className="container" onSubmit={handleSubmit}>
                    <div className="header">
                        <div className="text">Login</div>
                        <div className="underline"></div>
                    </div>
                    <div className="inputs">
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input
                                type="email"
                                placeholder="Email Id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="submit-container">
                        <button className="submit">Log in</button>
                    </div>
                    <div className="login">
                        Don't have a account?{" "}
                        <Link to={"/signup"} style={{ textDecoration: "none" }}>
                            <span>Sign-up Here!</span>
                        </Link>
                    </div>
                </form>
            </>
        );
    };
    return props.user ? <Navigate to="/" /> : getLoginForm();
};
export default Login;
