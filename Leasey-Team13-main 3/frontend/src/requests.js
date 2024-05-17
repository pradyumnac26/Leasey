import axios from "axios";

const IP_ADDRESS = "http://3.81.123.142:8080";
// const IP_ADDRESS = "http://localhost:8080";

export const getUser = async function (token) {
    const res = await axios.get(`${IP_ADDRESS}/get-user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const loginUser = async function (email, password) {
    const res = await axios.post(`${IP_ADDRESS}/login`, { email, password });

    return res.data;
};

export const logoutUser = async function (token) {
    const res = await axios
        .get(`${IP_ADDRESS}/logout`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const signupUser = async function (username, email, password) {
    const res = await axios
        .post(`${IP_ADDRESS}/signup`, {
            username,
            email,
            password,
        })
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const createListing = async function (formData, token) {
    const res = await axios
        .post(`${IP_ADDRESS}/create_listing`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const getHouseData = async function (id) {
    const res = await axios
        .get(`${IP_ADDRESS}/house_overview`, {
            params: {
                id: id,
            },
        })
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const getAllListings = async function () {
    const res = await axios.get(`${IP_ADDRESS}/view_listings`);
    return res.data;
};

export const searchListings = async function (query) {
    const res = await axios
        .get(`${IP_ADDRESS}/search`, {
            params: query,
        })
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const editLisitng = async function (formData, token) {
    const res = await axios
        .post(`${IP_ADDRESS}/edit_listing`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((err) => {
            return err;
        });
    return res;
};

export const deleteListing = async function (id, token) {
    const res = await axios
        .post(
            `${IP_ADDRESS}/delete_listing`,
            { id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const getUserListings = async function (token) {
    const res = await axios
        .get(`${IP_ADDRESS}/view_user_listings`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const getStateAnalysis = async function (state) {
    const res = await axios
        .get(`${IP_ADDRESS}/state_analysis`, {
            params: {
                state,
            },
        })
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const getUniversityAnalysis = async function (university) {
    const res = await axios
        .get(`${IP_ADDRESS}/university_analysis`, {
            params: {
                university,
            },
        })
        .catch((err) => {
            return err;
        });
    return res.data;
};

export const getExistingStateRent = async function (state) {
    const res = await axios
        .get(`${IP_ADDRESS}/existing_state_rent`, {
            params: {
                state,
            },
        })
        .then(console.log("GOT DATA"))
        .catch((err) => {
            return err;
        });
    return res.data;
};
