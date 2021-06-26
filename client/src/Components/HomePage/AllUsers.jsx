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
                console.log(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }, [])
    return (
        <>
            <div className="allUserParent">
                <div className="allUserContainer">
                    {
                        loading ? <p>loading.....</p>
                            :
                            allUsers.map((val, i) => {
                                return (
                                    <>
                                        <div className="allUserProfile">
                                            <img src={val.PicUrl} className="allUserProfileImage"></img>
                                            <NavLink className="allUserProfileUsername" key={i} to={`/profile/${val._id}`}>
                                                <p>{val.username}</p>
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
