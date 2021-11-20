import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";
import ReactLoading from "react-loading"
import Pagebreadcrumb from "../SmallComponents/PageBreadcrumb"
import { AccountBox } from "@material-ui/icons";
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
            <Pagebreadcrumb heading="Following" url="profile" base="Dashboard" />
            {
                isLoading ?
                    <>
                        <div className="container-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    (following.length === 0) ?
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
                                following.map((val, i) => {
                                    return (
                                        <>
                                            <div className="container-fluid mb-3">
                                                <div className="card shadow-sm flex-row">
                                                    <div className="card-image-top container-center-all p-3">
                                                        <img src={val.PicUrl} className="user-post-small-pic" alt="user profile"></img>
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
export default Following;
