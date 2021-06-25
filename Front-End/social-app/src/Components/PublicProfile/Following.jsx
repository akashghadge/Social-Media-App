import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";

const Following = () => {
    let [isLoading, setLoading] = useState(false);
    const params = useParams();
    let [following, setFollowing] = useState([]);
    console.log(following);
    useEffect(() => {
        const urlForFollowing = "http://localhost:5000/api/follow/following/all"; const followBody = {
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
            <h1 className="signINUPHead" style={{ textAlign: "center" }}>Following</h1>
            {
                isLoading ? <p>loading...</p> :
                    (following.length === 0) ? <h1 className="signINUPHead" style={{ textAlign: "center" }}>No Following are here</h1>
                        :
                        <>
                            {
                                following.map((val, i) => {
                                    return (
                                        <>
                                            <div className="postContainer">
                                                <div className="singlePost">
                                                    <div className="singlePostHeading">
                                                        <div className="singlePostHeadingColunm1">
                                                            <img src={val.PicUrl} className="singlePostUserPic"></img>
                                                        </div>
                                                        <div className="singlePostHeadingColunm2">
                                                            <NavLink className="singlePostUsername" exact to={`/profile/${val._id}/`}>
                                                                <h3 className="singlePostUsername">{val.username}</h3>
                                                            </NavLink>
                                                            <p className="singlePostName">{`${val.fname} ${val.lname}`}</p>
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
