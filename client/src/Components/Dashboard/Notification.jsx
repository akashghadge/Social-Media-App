import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import ReactLoading from "react-loading"
const Notification = () => {
    let [loading, setLoading] = useState(false);
    let [notificationAll, setNotificationAll] = useState([]);
    let [notificationCount, setNotificationCount] = useState(0);
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token == null) {
            setNotificationCount(0);
        }
        else {
            setLoading(true);
            const urlNotification = "/api/notification/all";
            axios.post(urlNotification, {
                token: token
            })
                .then((data) => {
                    setLoading(false);
                    if (data.data == null || data.data.length == 0) {
                        setNotificationCount(0);
                    }
                    else {
                        console.log(data);
                        setNotificationAll(data.data);
                        setNotificationCount(0);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                })
        }
    }, [])


    return (<>
        <div className="notificationContainer">
            <h2 style={{ margin: "2rem" }}>Notifications</h2>
            {
                loading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    notificationAll.map((val, i) => {
                        return (
                            <>
                                <h4>{val.notification}</h4>
                                <p className="singlePostDate">{moment(val.createdAt).format("H:mm a, MMMM Do YYYY")}</p>
                            </>
                        )
                    })
            }
        </div>
    </>);
}

export default Notification;
