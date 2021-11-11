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
        axios.post("/api/chat/user-list", { id: LoggedUser._id })
            .then((data) => {
                setTotalUsers(data.data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    let [chatUser, setChatUser] = useState("");
    function changeChatUser(e, newChatUser, newChatUsername) {
        const newChatUserObj =
        {
            id: newChatUser,
            username: newChatUsername
        }
        setChatUser(newChatUserObj);
    }
    return (
        <>
            <SocketContext.Provider value={getSocket({ id: LoggedUser._id, username: LoggedUser.username })}>
                <h2 className="heading-chat">Chat App</h2>
                <div className="container-chat">
                    <div className="">
                        <h4>Users</h4>
                        <ul style={{ listStyle: "none" }}>
                            {
                                totalUsers !== undefined ?
                                    totalUsers.map((val, i) => {
                                        return <li key={i} value={val._id} onClick={(e) => { changeChatUser(e, val._id, val.username) }} style={{ cursor: "pointer", marginTop: "1rem" }}>{val.username}</li>
                                    })
                                    : null
                            }
                        </ul>
                    </div>
                    <div className="col-chat-2">
                        <ChatWindow totalUsers={totalUsers} recUser={chatUser.id} recUserName={chatUser.username} ></ChatWindow>
                    </div>
                </div>
            </SocketContext.Provider>
        </>
    )
}
export default ChatMain;
