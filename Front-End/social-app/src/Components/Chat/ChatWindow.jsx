import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from "react-redux"
import { useHistory } from 'react-router';
import axios from 'axios';
import { SocketContext } from '../../contexts/SocketContext';
import { Button } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { Send } from "@material-ui/icons"
const useStyles = makeStyles((theme) => ({
    profileButtonFollow: {
        color: "#00ff00",
        backgroundColor: "white",
        '&:hover': {
            color: "white",
            backgroundColor: "#22ff22",
        },
    }

}));
const moment = require("moment");
const ChatWindow = (props) => {
    const classes = useStyles();
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
                <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    {props.recUserName}
                </h1>
                {
                    isTyping ? <p>{typerPerson} Typing...</p> : null
                }
            </div>
            <hr></hr>
            <div className="chatChatWindowShow">
                {
                    prevM.length === 0 ? <p>No prev chats</p> : prevM.map((val, i) => {
                        return (
                            (LoggedUser.username === val.sender.username) ?
                                < div key={i} style={{ textAlign: "right" }}>
                                    <h4>{val.text}</h4>
                                    <p className="chatWindowChatsText">{val.sender.username}</p>
                                    <p className="chatWindowChatsText">{moment(val.created).format("H:mm a, MMMM Do YYYY")}</p>
                                </div> :
                                <div key={i} style={{ textAlign: "left" }}>
                                    <h4>{val.text}</h4>
                                    <p className="chatWindowChatsText">{val.sender.username}</p>
                                    <p className="chatWindowChatsText">{moment(val.created).format("H:mm a, MMMM Do YYYY")}</p>
                                </div>
                        )
                    })
                }
            </div>
            <hr style={{ margin: "1rem" }}></hr>
            <div className="chatInputBox">
                <input type="text" className="chatWindowInput" value={chatBoxInput} onChange={inputChange}></input>
                <Send onClick={sendMessage} className={classes.profileButtonFollow}></Send>
            </div>
        </>
    );
}

export default ChatWindow;
