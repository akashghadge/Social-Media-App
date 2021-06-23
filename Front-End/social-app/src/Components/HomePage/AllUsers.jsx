import React, { useState, useEffect } from "react"
import axios from 'axios';
import { NavLink } from "react-router-dom"
const AllUsers = () => {
    let [loading, setLoading] = useState(false);
    let [allUsers, setAllUsers] = useState([]);
    useEffect(() => {
        setLoading(true);
        const urlForAllUsers = "http://localhost:5000/api/user/all-users-homepage";
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
            <div style={{ textAlign: "center" }}>

                <h1>All User</h1>
                <br></br>
                <br></br>
                {
                    loading ? <p>loading.....</p>
                        :
                        allUsers.map((val, i) => {
                            return <NavLink key={i} to={`/profile/${val._id}`}>
                                <p>{val.username}</p>
                            </NavLink>
                        })
                }
                <br></br>
                <br></br>
            </div>
        </>
    )
}
export default AllUsers;
