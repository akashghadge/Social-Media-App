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
    function listClasses(username) {
        let classes = "shadow-sm p-3 cursor-pointer";
        if (username === chatUser.username)
            classes += " active-chat-member"
        else
            classes += " "
        return classes;
    }
    return (
        <>
            <SocketContext.Provider value={getSocket({ id: LoggedUser._id, username: LoggedUser.username })}>
                <h2 className="heading-chat my-4 text-default">Direct Messages</h2>
                <div className="container-fluid">
                    <div className="card">
                        <div className="row">
                            <div className="col-4">
                                <h3 className="text-center bg-default text-white mb-0 p-3">All Users</h3>
                                <ul className="list-style-none rounded-2 p-0 m-0">
                                    {
                                        totalUsers !== undefined ?
                                            totalUsers.map((val, i) => {
                                                return (
                                                    <>
                                                        <li className={listClasses(val.username)} key={i} value={val._id} onClick={(e) => { changeChatUser(e, val._id, val.username) }}>
                                                            {val.username}
                                                        </li>
                                                    </>
                                                )
                                            })
                                            : null
                                    }
                                </ul>
                            </div>
                            <div className="col-8">
                                <ChatWindow totalUsers={totalUsers} recUser={chatUser.id} recUserName={chatUser.username} ></ChatWindow>
                            </div>
                        </div>
                    </div>
                </div>
            </SocketContext.Provider>
        </>
    )
}
export default ChatMain;
