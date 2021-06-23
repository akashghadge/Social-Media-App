import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from "react-redux"
import { useHistory } from 'react-router';
import axios from 'axios';
import { SocketContext } from '../../contexts/SocketContext';
const moment = require("moment");

const ChatWindow = (props) => {
    let history = useHistory();
    // getting current user
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    const socket = useContext(SocketContext);
    let [prevM, setPrevM] = useState([]);
    let [reloadHelper, setReload] = useState(1);
    let [isTyping, setTyping] = useState(false);
    let [typerPerson, setTyperPerson] = useState("");
    useEffect(() => {
        if (!LoggedUser._id) {
            history.push("/profile");
        }
        const prevChatMessages = "http://localhost:5000/api/chat/prev-messages";
        axios.post(prevChatMessages, {
            SenderId: LoggedUser._id,
            RecId: props.recUser
        })
            .then((data) => {
                // here if there is no chat then there is no user present there data.data is emtpy it tends to null.chats 
                // so we check first
                if (data.data === null) {
                    setPrevM([]);
                }
                else {
                    setPrevM(data.data.chats);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        socket.on("rec-message", (data) => {
            let newArr = prevM;
            newArr.push(data);
            setPrevM(newArr);
        });
        socket.on("rec-typing", (data) => {
            setTyperPerson(data.username);
            setTyping(true);
            setTimeout(() => {
                setTyping(false);
            }, 3000);
        })
    }, [props.recUser, props.recUserName, reloadHelper])

    let [chatBoxInput, setChatBoxInput] = useState("");
    function inputChange(e) {
        socket.emit("typing", props.recUser);
        setChatBoxInput(e.target.value);
    }
    function sendMessage(e) {
        const payload = {
            recipent: props.recUser,
            text: chatBoxInput
        }
        socket.emit("send-message", payload);
        setReload(++reloadHelper);
    }
    return (
        <>
            <div>
                <h1>
                    {props.recUserName}
                </h1>
            </div>
            <div>
                {
                    isTyping ? <p>{typerPerson} Typing...</p> : null
                }
            </div>
            <input type="text" value={chatBoxInput} onChange={inputChange}></input>
            <button onClick={sendMessage}> Send</button>
            <div>
                {
                    prevM.length === 0 ? <p>No prev chats</p> : prevM.map((val, i) => {
                        return (
                            <div key={i}>
                                <h4>{val.text}</h4>
                                <p>{val.sender.username}</p>
                                <p>{moment(val.created).format("H:mm a, MMMM Do YYYY")}</p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}

export default ChatWindow;
