import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import ReactLoading from "react-loading"
import http from "../../helper/http";

const AllUsers = () => {
    let [loading, setLoading] = useState(false);
    let [allUsers, setAllUsers] = useState([]);
    useEffect(async function () {
        setLoading(true);
        let allusers = await http.getAllUsers();
        setAllUsers(allusers);
        setLoading(false);

    }, [])
    return (
        <>
            <div className="mt-3">
                <div className="all-user-container">
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
                                        <div key={val._id} className="decoration-none mx-3 text-center">
                                            <img src={val.PicUrl} className="all-user-image" alt="user pic"></img>
                                            <NavLink className="decoration-none  text-dark font-weight-bold" key={i} to={`/profile/${val._id}`}>
                                                <p className="mb-0">{val.username}</p>
                                            </NavLink>
                                        </div>
                                    </>
                                )
                            })
                    }
                </div>
            </div>
        </>
    )
}
export default AllUsers;
