import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
import axios from "axios"

import ChatWindow from "./ChatWindow"
import { SocketContext, getSocket } from "../../contexts/SocketContext"
import Singleuserchat from "../SmallComponents/SingleUserChat"
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
                <div>
                    <div className="row">
                        <div className="col-3">
                            <h4 className="text-dark bg-transparent mb-0 p-3">Inbox</h4>
                            <p className="text-muted px-3 mt-2">All users</p>
                            <ul className="list-style-none rounded-2 p-0 m-0">
                                {
                                    totalUsers !== undefined ?
                                        totalUsers.map((val, i) => {
                                            return <Singleuserchat key={val._id} id={val._id} chatUser={chatUser.username} username={val.username} changeChatUser={changeChatUser} />
                                        })
                                        : null
                                }
                            </ul>
                        </div>
                        <div className="col-9 chat-window-main">
                            <ChatWindow totalUsers={totalUsers} recUser={chatUser.id} recUserName={chatUser.username} ></ChatWindow>
                        </div>
                    </div>
                </div>
            </SocketContext.Provider>
        </>
    )
}
export default ChatMain;
