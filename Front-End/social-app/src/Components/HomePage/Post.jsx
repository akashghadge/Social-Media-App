import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
const Post = () => {
    let [flagForReq, setFlag] = useState(0);
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    let history = useHistory();
    if (!LoggedUser._id) {
        history.push("/profile");
    }
    // console.log(LoggedUser);
    let [totalPosts, setTotalPosts] = useState([]);
    useEffect(() => {
        // console.log("use effect triggered !!!!!!!!!!!!!!!");
        const urlForAllPost = "http://localhost:5000/api/post/all";
        axios.post(urlForAllPost, {})
            .then((data) => {
                console.log(data.data);
                setTotalPosts(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [flagForReq]);

    const addLike = (event, idPost) => {
        const urlAddLike = "http://localhost:5000/api/post/like/add";
        let token = localStorage.getItem("token");

        const body = {
            token: token,
            idOfPost: idPost
        };
        axios.post(urlAddLike, body)
            .then((data) => {
                console.log(data);
                setFlag(++flagForReq);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }
    const removeLike = (event, idPost) => {
        const urlRemoveLike = "http://localhost:5000/api/post/like/remove";
        let token = localStorage.getItem("token");
        const body = {
            token: token,
            idOfPost: idPost
        };
        axios.post(urlRemoveLike, body)
            .then((data) => {
                console.log(data);
                setFlag(++flagForReq);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }
    return (
        <>
            {
                (totalPosts === undefined) ? null : totalPosts.map((val, i, arr) => {
                    return (
                        <>
                            <div>
                                <img src={val.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                                <h3>{val.desc}</h3>
                                {/* do in production */}
                                <NavLink exact to={`profile/${val.postedBy._id}`}>
                                    <h3>{val.postedBy.username}</h3>
                                </NavLink>
                                {
                                    (val.likes.includes(LoggedUser._id))
                                        ?
                                        <button onClick={(e) => { removeLike(e, val._id) }}>Unlike :{val.likes.length}</button> :
                                        <button onClick={(e) => { addLike(e, val._id) }}>Like :{val.likes.length}</button>
                                }
                            </div>
                        </>
                    )
                })
            }
        </>
    )
}
export default Post;
