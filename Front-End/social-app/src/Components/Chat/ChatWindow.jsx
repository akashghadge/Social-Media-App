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
    let [prevM, setPrevM] = useState([]);
    let [reloadHelper, setReload] = useState(1);
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
                setPrevM(data.data.chats);
                // console.log(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
        socket.on("rec-message", (data) => {
            console.log(data);
        });
    }, [props.recUser, reloadHelper])

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
        setReload(++reloadHelper);
    }
    return (
        <>
            <div>
                <h1>
                    {props.recUserName}
                </h1>
            </div>
            <input type="text" value={chatBoxInput} onChange={inputChange}></input>
            <button onClick={sendMessage}> Send</button>
            <div>
                {
                    prevM.map((val, i) => {
                        return (
                            <div>
                                <h4>{val.text}</h4>
                                <p>{val.sender.username}</p>
                                <p>{val.created}</p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}

export default ChatWindow;
