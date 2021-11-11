import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";
import ReactLoading from "react-loading"
const Following = () => {
    let [isLoading, setLoading] = useState(false);
    const params = useParams();
    let [following, setFollowing] = useState([]);
    console.log(following);
    useEffect(() => {
        const urlForFollowing = "/api/follow/following/all"; const followBody = {
            userId: params.id
        };
        axios.post(urlForFollowing, followBody)
            .then((data) => {
                setLoading(false);
                setFollowing(data.data.following);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
    }, []);
    return (
        <>
            <h1 className="heading-dash" style={{ textAlign: "center" }}>Following</h1>
            {
                isLoading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    (following.length === 0) ? <h1 className="heading-dash" style={{ textAlign: "center" }}>No Following are here</h1>
                        :
                        <>
                            {
                                following.map((val, i) => {
                                    return (
                                        <>
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
                                        </>
                                    )
                                })
                            }
                        </>
            }
        </>
    )
}
export default Following;
