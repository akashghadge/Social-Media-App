import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { useSelector } from "react-redux"
import { useHistory } from 'react-router';
import axios from 'axios';
import { SocketContext } from '../../contexts/SocketContext';


const ChatWindow = (props) => {
    let history = useHistory();
    // getting current user
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    const socket = useContext(SocketContext);
    useEffect(() => {
        if (!LoggedUser._id) {
            history.push("/profile");
        }
        socket.on("rec-message", (data) => {
            console.log(data);
        });
    }, [])

    let [chatBoxInput, setChatBoxInput] = useState("");
    function inputChange(e) {
        setChatBoxInput(e.target.value);
    }
    function sendMessage(e) {
        const payload = {
            recipent: props.recUser,
            text: chatBoxInput
        }
        socket.emit("send-message", payload);
    }
    return (
        <>
            <div>

            </div>
            <input type="text" value={chatBoxInput} onChange={inputChange}></input>
            <button onClick={sendMessage}> Send</button>
        </>
    );
}

export default ChatWindow;
