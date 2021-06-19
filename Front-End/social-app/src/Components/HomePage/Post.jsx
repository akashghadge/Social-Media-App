import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import axios from "axios"

const Post = () => {
    let [totalPosts, setTotalPosts] = useState([]);
    useEffect(() => {
        const urlForAllPost = "http://localhost:5000/api/post/all";
        axios.post(urlForAllPost, {})
            .then((data) => {
                console.log(data);
                setTotalPosts(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return (
        <>
            {
                (totalPosts === undefined) ? null : totalPosts.map((val, i, arr) => {
                    return (
                        <>
                            <img src={val.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                            <h3>{val.desc}</h3>
                            {/* do in production */}
                            <NavLink exact to={`profile/${val.postedBy._id}`}>
                                <h3>{val.postedBy.username}</h3>
                            </NavLink>
                        </>
                    )
                })
            }
        </>
    )
}
export default Post;
