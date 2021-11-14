import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from "react-redux"
import { useHistory } from 'react-router';
import axios from 'axios';
import { SocketContext } from '../../contexts/SocketContext';
import { makeStyles } from '@material-ui/core/styles';
import { Send } from "@material-ui/icons"
const useStyles = makeStyles((theme) => ({
    profileButtonFollow: {
        color: "#220080",
        fontSize: "40px",
        borderRadius: "1rem",
        '&:hover': {
            color: "white",
            backgroundColor: "#220080",
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
        const prevChatMessages = "/api/chat/prev-messages";
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
        setChatBoxInput("");
    }
    return (
        <>
            <div className="chat-window-main">
                <div className="bg-white mx-3 mt-3 shadow-sm rounded-3">
                    <h3 className="px-3 pt-3 mb-0 font-weight-bold">
                        {props.recUserName === undefined ? "Select User " : props.recUserName}
                    </h3>
                    <p className="px-3 pb-2 text-muted font-10">
                        {
                            isTyping ?
                                `${typerPerson} is typing...`
                                : "Not Active"
                        }
                    </p>
                </div>
                <div className="chat-window">
                    {
                        prevM.length === 0 ?
                            <div className="d-flex justify-content-center">
                                <p className="chat-prev-no-chats text-muted">No previous messages</p>
                            </div>
                            :
                            prevM.map((val, i) => {
                                return (
                                    (LoggedUser.username === val.sender.username) ?
                                        <div key={val.created} className="d-flex justify-content-end">
                                            <div key={val.username} className="mb-3">
                                                <p className="chat-message-section-user">{val.text}</p>
                                                <p className="chat-message-text text-end">{val.sender.username}</p>
                                                <p className="chat-message-text text-end">{moment(val.created).format("H:mm a, MMMM Do YYYY")}</p>
                                            </div>
                                        </div>
                                        :
                                        <div key={val.created} className="d-flex justify-content-start px-3">
                                            <div key={val.username} className="mb-3">
                                                <p className="chat-message-section-user-2">{val.text}</p>
                                                <p className="chat-message-text">{val.sender.username}</p>
                                                <p className="chat-message-text">{moment(val.created).format("H:mm a, MMMM Do YYYY")}</p>
                                            </div>
                                        </div>
                                )
                            })
                    }
                </div>
                <div className="row">
                    <div className="col-10">
                        <input type="text" className="form-control b-radius-input font-30" value={chatBoxInput} onChange={inputChange}></input>
                    </div>
                    <div className="col-2 text-center">
                        <Send onClick={sendMessage} className={classes.profileButtonFollow}></Send>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatWindow;
