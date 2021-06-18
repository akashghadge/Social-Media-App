import React, { useState } from "react"
import ReactDOM from "react-dom"
// redux stuff
import { useSelector } from "react-redux";


const Home = () => {
    // redux stuff
    let LoggedUser = useSelector((state) => {
        return state.User;
    })
    return (
        <>
            <h1>Home</h1>
        </>
    )
}
export default Home;
