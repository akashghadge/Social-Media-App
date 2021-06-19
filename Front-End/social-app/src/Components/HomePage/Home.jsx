import React, { useState } from "react"
// redux stuff
import { useSelector } from "react-redux";
// components
import Post from "./Post";
import AllUsers from "./AllUsers";



const Home = () => {
    // redux stuff
    let LoggedUser = useSelector((state) => {
        return state.User;
    })
    return (
        <>
            <Post></Post>
            <AllUsers></AllUsers>
        </>
    )
}
export default Home;
