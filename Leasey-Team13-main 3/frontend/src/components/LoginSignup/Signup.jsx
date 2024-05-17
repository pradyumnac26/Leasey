import React, { useState } from "react";
import "./LoginSignup.css";

import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../requests";
import AlertBanner from "../AlertBanner/AlertBanner";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignup = (e) => {
        e.preventDefault();

        signupUser(username, email, password)
            .then(() => {
                navigate("/login");
            })
            .catch((err) => {
                setErrorMessage(err.response.data.msg);
            });
    };

    return (
        <>
            <AlertBanner
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
            <form className="container" onSubmit={handleSignup}>
                <div className="header">
                    <div className="text">Sign Up</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input
                            type="email"
                            placeholder="Email Id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit">
                        Sign Up
                    </button>
                </div>
                <div className="login">
                    Already have a account?{" "}
                    <Link to={"/login"} style={{ textDecoration: "none" }}>
                        <span>Login Here!</span>
                    </Link>
                </div>
            </form>
        </>
    );
};
export default Signup;
