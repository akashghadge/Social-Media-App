import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";
import ReactLoading from "react-loading"
const Followers = () => {
    let [isLoading, setLoading] = useState(false);
    let [followers, setFollowers] = useState([]);
    const params = useParams();

    useEffect(() => {
        const urlForFollower = "/api/follow/followers/all";
        const followBody = {
            userId: params.id
        };
        axios.post(urlForFollower, followBody)
            .then((data) => {
                console.log(data);
                setFollowers(data.data.followers);
                console.log(data.data.followers);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
    }, []);
    return (
        <>
            <h1 className="heading-dash" style={{ textAlign: "center" }}>Followers</h1>
            {
                isLoading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    (followers.length === 0) ? <h1 className="heading-dash" style={{ textAlign: "center" }}>No Followers are here</h1>
                        :
                        <>
                            {
                                followers.map((val, i) => {
                                    return (
                                        <div className="container-center-all">
                                            <div className="">
                                                <div className="heading-div-post">
                                                    <div className=" ">
                                                        <img src={val.PicUrl} className="user-post-small-pic"></img>
                                                    </div>
                                                    <div className=" ">
                                                        <NavLink className="navlink-post-profile" exact to={`/profile/${val._id}/`}>
                                                            <h3 className="navlink-post-profile">{val.username}</h3>
                                                        </NavLink>
                                                        <p className="full-name-post-profile">{`${val.fname} ${val.lname}`}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
            }
        </>
    )
}
export default Followers;
