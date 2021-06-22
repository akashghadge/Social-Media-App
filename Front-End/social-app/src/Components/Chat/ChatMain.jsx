import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"

import axios from "axios"

import ChatWindow from "./ChatWindow"
import { SocketContext, getSocket } from "../../contexts/SocketContext"
const ChatMain = () => {
    let history = useHistory();
    // getting current user
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    let [totalUsers, setTotalUsers] = useState([]);
    useEffect(() => {
        if (!LoggedUser._id) {
            history.push("/profile");
        }
        axios.post("http://localhost:5000/api/chat/user-list", { id: LoggedUser._id })
            .then((data) => {
                setTotalUsers(data.data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    return (
        <>
            <SocketContext.Provider value={getSocket(LoggedUser._id)}>

                <h2 style={{ textAlign: "center" }}>Chat App</h2>
                {
                    totalUsers != undefined ?
                        totalUsers.map((val, i) => {
                            return <ChatWindow key={i} recUser={val._id} ></ChatWindow>
                        })
                        : null
                }
            </SocketContext.Provider>
        </>
    )
}
export default ChatMain;
