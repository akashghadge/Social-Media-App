import React, { useState, useEffect } from "react"
// redux stuff
import { useSelector } from "react-redux";
// components
import Post from "./Post";
import AllUsers from "./AllUsers";

import { useHistory } from "react-router-dom";
import axios from "axios";
// redux
import { useDispatch } from "react-redux";
import saveUser from "../../actions/saveUser"

 

const Home = () => {
    // redux stuff
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    // console.log(LoggedUser);
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
