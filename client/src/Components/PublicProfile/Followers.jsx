import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";
import ReactLoading from "react-loading"
import { AccountBox } from "@material-ui/icons";
import Pagebreadcrumb from "../SmallComponents/PageBreadcrumb";

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
            <Pagebreadcrumb heading="Followers" url="profile" base="Dashboard" />
            {
                isLoading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    (followers.length === 0) ?
                        <div className="container-fluid">
                            <div className="card shadow-sm flex-row">
                                <div className="card-image-top container-center-all p-3">
                                    <AccountBox></AccountBox>
                                </div>
                                <div className="card-body d-flex">
                                    <h4 className="card-title w-50 my-auto text-capitalize">No Followers</h4>
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            {
                                followers.map((val, i) => {
                                    return (
                                        <>
                                            <div className="container-fluid mb-3">
                                                <div className="card shadow-sm flex-row">
                                                    <div className="card-image-top container-center-all p-3">
                                                        <img src={val.PicUrl} className="user-post-small-pic"></img>
                                                    </div>
                                                    <div className="card-body d-flex">
                                                        <NavLink className="card-title font-20 w-50 my-auto text-capitalize navlink-post-profile" exact to={`/profile/${val._id}/`}>
                                                            <h3 className="navlink-post-profile">{val.username}</h3>
                                                        </NavLink>
                                                        <p className="card-text text-muted font-14 w-25 my-auto">
                                                            {`${val.fname} ${val.lname}`}
                                                        </p>
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
export default Followers;
