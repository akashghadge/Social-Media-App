import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
const Notification = () => {
    let [notificationAll, setNotificationAll] = useState([]);
    let [notificationCount, setNotificationCount] = useState(0);
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token == null) {
            setNotificationCount(0);
        }
        else {
            const urlNotification = "http://localhost:5000/api/notification/all";
            axios.post(urlNotification, {
                token: token
            })
                .then((data) => {
                    if (data.data == null || data.data.length == 0) {
                        setNotificationCount(0);
                    }
                    else {
                        console.log(data);
                        setNotificationAll(data.data);
                        setNotificationCount(0);
                    }
                })
        }
    }, [])


    return (<>
        <div className="notificationContainer">
            <h2 style={{ margin: "2rem" }}>Notifications</h2>
            {
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
