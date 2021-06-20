import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
const SinglePost = (props) => {
    let history = useHistory();
    // getting current user
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    // flag for sending signal to relaod post data
    let [flagForReq, setFlag] = useState(0);
    useEffect(() => {
        props.handleChangeInPost(flagForReq);
    }, [flagForReq]);

    // add like if user is not logged in or after logged in it refreshes page we not add like other wise
    // we route it to profile
    const addLike = (event, idPost) => {
        if (!LoggedUser._id) {
            history.push("/profile");
        }
        const urlAddLike = "http://localhost:5000/api/post/like/add";
        let token = localStorage.getItem("token");

        const body = {
            token: token,
            idOfPost: idPost
        };
        axios.post(urlAddLike, body)
            .then((data) => {
                setFlag(++flagForReq);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }
    const removeLike = (event, idPost) => {
        if (!LoggedUser._id) {
            history.push("/profile");
        }
        const urlRemoveLike = "http://localhost:5000/api/post/like/remove";
        let token = localStorage.getItem("token");
        const body = {
            token: token,
            idOfPost: idPost
        };
        axios.post(urlRemoveLike, body)
            .then((data) => {
                setFlag(++flagForReq);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }
    let [commentButton, setCommentButton] = useState(false);
    let [commentInfo, setCommentInfo] = useState("");
    let [commentLoading, setCommentLoading] = useState(false);
    function onCommentButton(e, postId) {
        setCommentLoading(true);
        setCommentButton(!commentButton);
        const urlComment = "http://localhost:5000/api/post/comment";
        const body = {
            idOfPost: postId
        };
        axios.post(urlComment, body).then((data) => {
            setCommentInfo(data.data.comments);
            setCommentLoading(false);
        })
            .catch((err) => {
                console.log(err)
                setCommentLoading(false);
            });
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
        const urlForAddNewComment = "http://localhost:5000/api/post/comment/add";
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
            })
            .catch((err) => {
                setFlag(++flagForReq);
                console.log(err);
            })
    }

    return (
        <>
            <div>
                <img src={props.val.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                <h3>{props.val.desc}</h3>
                {/* do in production */}
                <NavLink exact to={`profile/${props.val.postedBy._id}`}>
                    <h3>{props.val.postedBy.username}</h3>
                </NavLink>
                {/* like section */}
                {
                    (props.val.likes.includes(LoggedUser._id))
                        ?
                        <button onClick={(e) => { removeLike(e, props.val._id) }}>Unlike :{props.val.likes.length}</button> :
                        <button onClick={(e) => { addLike(e, props.val._id) }}>Like :{props.val.likes.length}</button>
                }
                <br></br>
                {/* comment section */}
                {
                    <button onClick={(e) => {
                        onCommentButton(e, props.val._id)
                    }}>Comments : {props.val.comments.length}</button>
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
                        createCommentButton(e, props.val._id);
                    }}>Create Comment</button>
                }
                {
                    (isCreateCommentOn) ?
                        <>
                            <input type="text" onChange={newCommentHandle} value={newComment}></input>
                            <button onClick={(e) => {
                                addNewComment(e, props.val._id);
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
}
export default SinglePost;
