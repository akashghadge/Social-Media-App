// react imports
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from "react-redux"
import { useHistory } from 'react-router';
// library imports
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Send } from "@material-ui/icons"
// normal imports
import { SocketContext } from '../../contexts/SocketContext';
import { DateFormate } from "../../helper/utilities"

const useStyles = makeStyles((theme) => ({
    profileButtonFollow: {
        color: "#220080",
        fontSize: "30px",
        '&:hover': {
            color: "white",
            backgroundColor: "#220080",
        },
    }

}));


const ChatWindow = (props) => {
    // instances
    const classes = useStyles();
    let history = useHistory();
    const socket = useContext(SocketContext);
    // getting current user
    const LoggedUser = useSelector((state) => {
        return state.User;
    })

    // data
    let [prevM, setPrevM] = useState([]);
    let [reloadHelper, setReload] = useState(1);
    let [isTyping, setTyping] = useState(false);
    let [typerPerson, setTyperPerson] = useState("");
    let [chatBoxInput, setChatBoxInput] = useState("");

    // lifecycle
    useEffect(() => {
        if (!LoggedUser._id) {
            history.push("/profile");
        }
        const prevChatMessages = "/api/chat/prev-messages";
        axios.post(prevChatMessages, {
            SenderId: LoggedUser._id,
            RecId: props.recUser
        }).then((data) => {
            console.log(data);
            // here if there is no chat then there is no user present there data.data is emtpy it tends to null.chats 
            // so we check first
            if (data.data === null) {
                setPrevM([]);
            }
            else {
                setPrevM(data.data.chats);
            }
        }).catch((err) => {
            console.log(err);
        })
    }, [props.recUser, reloadHelper])

    useEffect(() => {
        socket.on("rec-message", (data) => {
            setReload(++reloadHelper);
        });
        socket.on("rec-typing", (data) => {
            setTyperPerson(data.username);
            setTyping(true);
            setTimeout(() => {
                setTyping(false);
            }, 3000);
        })
    }, [props.recUser])


    // methods
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
                {/* -------------------------------------------- */}
                {/* top header section */}
                {/* -------------------------------------------- */}
                <div className="bg-white mx-3 mt-3 shadow-sm rounded-3">
                    <h3 className="px-3 pt-3 mb-0 font-weight-bold">
                        {props.recUserName === undefined ? "Self Chat :) " : props.recUserName}
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
                                            <div className="mb-3">
                                                <p className="chat-message-section-user">{val.text}</p>
                                                <p className="chat-message-text text-end">{val.sender.username}</p>
                                                <p className="chat-message-text text-end">{DateFormate(val.created)}</p>
                                            </div>
                                        </div>
                                        :
                                        <div key={val.created} className="d-flex justify-content-start px-3">
                                            <div className="mb-3">
                                                <p className="chat-message-section-user-2">{val.text}</p>
                                                <p className="chat-message-text">{val.sender.username}</p>
                                                <p className="chat-message-text">{DateFormate(val.created)}</p>
                                            </div>
                                        </div>
                                )
                            })
                    }
                </div>
                <div className="row justify-content-around px-3">
                    <div className="col-9">
                        <input type="text" className="form-control b-radius-input font-30" value={chatBoxInput} onChange={inputChange}></input>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-outline-default rounded-2" onClick={sendMessage}>
                            <Send className={classes.profileButtonFollow}></Send>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatWindow;
