import React, {  useEffect } from "react"
// components
import Post from "./Post";
import AllUsers from "./AllUsers";

import axios from "axios";
// redux
import { useDispatch } from "react-redux";
import saveUser from "../../actions/saveUser"

 

const Home = () => {
    // redux stuff
    const dispatch = useDispatch();

    useEffect(() => {
        let token = localStorage.getItem("token");
        const urlProfileDetails = "http://localhost:5000/api/dashboard/profile";
        axios.post(urlProfileDetails, { token: token })
            .then((data) => {
                // redux storing the user for all usecases
                dispatch(saveUser(data.data));
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return (
        <>
            <Post></Post>
            <AllUsers></AllUsers>
        </>
    )
}
export default Home;
