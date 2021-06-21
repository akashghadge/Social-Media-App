import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import socketIoClient, { io } from "socket.io-client"
import axios from "axios"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
const ChatMain = () => {
    const ENDPOINT = "http://127.0.0.1:5000/"
    let history = useHistory();
    // getting current user
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    useEffect(() => {
        if (!LoggedUser._id) {
            history.push("/profile");
        }
        // socket initialisation
        const socket = socketIoClient(ENDPOINT);
        socket.emit("first-time-log", LoggedUser._id);
    }, [])
    return (
        <>
            <h2>Chat App</h2>
        </>
    )
}
export default ChatMain;
