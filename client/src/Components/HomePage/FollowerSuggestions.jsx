import React, { useState, useEffect } from 'react';
import ReactLoading from "react-loading"
import axios from 'axios';
import { NavLink } from "react-router-dom"
const Followersuggestions = () => {
    let [loading, setLoading] = useState(false);
    let [allUsers, setAllUsers] = useState([]);
    useEffect(() => {
        setLoading(true);
        const urlForAllUsers = "/api/user/all-users-homepage";
        axios.get(urlForAllUsers)
            .then((data) => {
                setAllUsers(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }, [])
    return (
        <>
            <div className="card b-radius-card mx-2 mt-3">
                <div className="card-body">
                    <h5 className="heading-home text-center p-2">You should follow </h5>
                    <hr></hr>
                    {
                        loading ?
                            <>
                                <div className="container-center-all">
                                    <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                </div>
                            </>
                            :
                            allUsers.map((val, i) => {
                                return (
                                    <>
                                        <div key={val._id} className="row decoration-none text-center">
                                            <div className="col-5 container-center-all">
                                                <img src={val.PicUrl} className="all-user-image" alt="user pic"></img>
                                            </div>
                                            <div className="col-7">
                                                <NavLink className="decoration-none  text-dark font-weight-bold" key={i} to={`/profile/${val._id}`}>
                                                    <p className="mb-1 text-truncate">{val.username}</p>
                                                </NavLink>
                                                <NavLink to={`/profile/${val._id}`}>
                                                    <button className="btn btn-default">Follow</button>
                                                </NavLink>
                                            </div>
                                            <hr className="my-3"></hr>
                                        </div>
                                    </>
                                )
                            })
                    }
                </div>
            </div>
        </>
    );
}

export default Followersuggestions;
