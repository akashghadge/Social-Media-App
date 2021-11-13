import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import ReactLoading from "react-loading"
import PageBreadcrumb from "../SmallComponents/PageBreadcrumb"
import { Notifications } from "@material-ui/icons"
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


    return (
        <>
            <PageBreadcrumb heading="Notifications" url="profile" base="Dashboard" />
            {
                loading ?
                    <>
                        <div className="container-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    : notificationAll.length == 0 ?
                        <>
                            <div className="container-fluid">
                                <div className="card shadow-sm flex-row">
                                    <div className="card-image-top container-center-all p-3">
                                        <Notifications></Notifications>
                                    </div>
                                    <div className="card-body d-flex">
                                        <h4 className="card-title w-50 my-auto text-capitalize">No Notifications</h4>
                                    </div>
                                </div>
                            </div>
                        </> :
                        notificationAll.map((val, i) => {
                            return (
                                <>
                                    <div className="container-fluid">
                                        <div className="card shadow-sm flex-row">
                                            <div className="card-image-top container-center-all p-3">
                                                <Notifications></Notifications>
                                            </div>
                                            <div className="card-body d-flex">
                                                <h4 className="card-title w-50 my-auto text-capitalize">{val.notification}</h4>
                                                <p className="card-text font-14 w-25 my-auto">
                                                    {moment(val.createdAt).format("H:mm a, MMMM Do YYYY")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })
            }
        </>
    );
}

export default Notification;
