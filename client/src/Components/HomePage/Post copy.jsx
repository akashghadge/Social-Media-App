import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
import SinglePost from "./SinglePost"
const Post = () => {
    let history = useHistory();

    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    if (!LoggedUser._id) {
        history.push("/profile");
    }

    let [totalPosts, setTotalPosts] = useState([]);
    let [flagForReq, setFlag] = useState(0);
    useEffect(() => {
        // console.log("use effect triggered !!!!!!!!!!!!!!!");
        const urlForAllPost = "/api/post/all";
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
        const urlAddLike = "/api/post/like/add";
        let token = localStorage.getItem("token");

        const body = {
            token: token,
            idOfPost: idPost
        };
        axios.post(urlAddLike, body)
            .then((data) => {
                // console.log(data);
                setFlag(++flagForReq);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }
    const removeLike = (event, idPost) => {
        const urlRemoveLike = "/api/post/like/remove";
        let token = localStorage.getItem("token");
        const body = {
            token: token,
            idOfPost: idPost
        };
        axios.post(urlRemoveLike, body)
            .then((data) => {
                // console.log(data);
                setFlag(++flagForReq);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }

    // comment flag
    let [commentButton, setCommentButton] = useState(false);
    let [commentInfo, setCommentInfo] = useState("");
    let [commentLoading, setCommentLoading] = useState(false);
    function onCommentButton(e, postId) {
        setCommentLoading(true);
        setCommentButton(!commentButton);
        const urlComment = "/api/post/comment";
        const body = {
            idOfPost: postId
        };
        axios.post(urlComment, body).then((data) => {
            setCommentInfo(data.data.comments);
            console.log(commentInfo)
            setCommentLoading(false);
        })
            .catch((err) => {
                console.log(err)
                setCommentLoading(false);
            });
        console.log(commentButton);
    }

    // create comment
    let [isCreateCommentOn, setCreateCommentOn] = useState(false);
    function createCommentButton(e, id) {
        setCreateCommentOn(!isCreateCommentOn);
    }
    let [newComment, setNewComment] = useState("");
    function newCommentHandle(e, idOfPost) {
        setNewComment(e.target.value);
    }

    // send comment
    function addNewComment(e, idOfPost) {
        const urlForAddNewComment = "/api/post/comment/add";
        let token = localStorage.getItem("token");
        const body =
        {
            token: token,
            idOfPost: idOfPost,
            text: newComment
        };
        axios.post(urlForAddNewComment, body)
            .then((data) => {
                setFlag(++flagForReq);
                console.log(data);
            })
            .catch((err) => {
                setFlag(++flagForReq);
                console.log(err);
            })
    }
    return (
        <>

            {
                (totalPosts === undefined) ? null : totalPosts.map((val, i, arr) => {
                    return (
                        <>
                            <SinglePost val={val} index={i}></SinglePost>
                            <div>
                                <img src={val.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                                <h3>{val.desc}</h3>
                                {/* do in production */}
                                <NavLink exact to={`profile/${val.postedBy._id}`}>
                                    <h3>{val.postedBy.username}</h3>
                                </NavLink>
                                {/* like section */}
                                {
                                    (val.likes.includes(LoggedUser._id))
                                        ?
                                        <button onClick={(e) => { removeLike(e, val._id) }}>Unlike :{val.likes.length}</button> :
                                        <button onClick={(e) => { addLike(e, val._id) }}>Like :{val.likes.length}</button>
                                }
                                <br></br>
                                {/* comment section */}
                                {
                                    <button onClick={(e) => {
                                        onCommentButton(e, val._id)
                                    }}>Comments : {val.comments.length}</button>
                                }
                                {
                                    (commentButton) ?
                                        commentLoading ? null :
                                            commentInfo.map((comment, i) => {
                                                return (
                                                    <>
                                                        <h3>{comment.text}</h3>
                                                        <NavLink exact to={`profile/${comment.postedBy._id}`}>
                                                            <p>{comment.postedBy.username}</p>
                                                        </NavLink>
                                                        <p>{comment.created}</p>
                                                    </>
                                                )
                                            })
                                        : null
                                }
                                <br></br>
                                {/* create comment */}
                                {
                                    <button onClick={(e) => {
                                        createCommentButton(e, val._id);
                                    }}>Create Comment</button>
                                }
                                {
                                    (isCreateCommentOn) ?
                                        <>
                                            <input type="text" onChange={newCommentHandle} value={newComment}></input>
                                            <button onClick={(e) => {
                                                addNewComment(e, val._id);
                                            }} >Add Comment</button>
                                        </>
                                        : null
                                }
                            </div>
                            <br></br>
                            <br></br>
                            <br></br>
                        </>
                    )
                })
            }
        </>
    )
}
export default Post;
