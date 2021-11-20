// basic react imports
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import axios from "axios"
import moment from "moment"
import { Favorite, FavoriteBorder, ChatBubbleOutline, AddComment, Send, Delete } from "@material-ui/icons"
import { Button } from "@material-ui/core"
// mui
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ReactLoading from "react-loading"
const SinglePost = (props) => {
    // snack bar code
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    const ErrorObject =
    {
        backgroundColor: "red",
        text: "Your Not Loggedin"
    }

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
            setSnackbarObj(ErrorObject);
            return setOpen(true);
        }
        const urlAddLike = "/api/post/like/add";
        let token = localStorage.getItem("token");

        const body = {
            token: token,
            idOfPost: idPost
        };
        axios.post(urlAddLike, body)
            .then((data) => {
                setFlag(++flagForReq);
                // showing the snackbar
                setSnackbarObj(
                    {
                        backgroundColor: "green",
                        text: "You Liked Post"
                    }
                );
                return setOpen(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    // remove if user commented or not
    const removeLike = (event, idPost) => {
        if (!LoggedUser._id) {
            setSnackbarObj(ErrorObject);
            return setOpen(true);
        }
        const urlRemoveLike = "/api/post/like/remove";
        let token = localStorage.getItem("token");
        const body = {
            token: token,
            idOfPost: idPost
        };
        axios.post(urlRemoveLike, body)
            .then((data) => {
                setFlag(++flagForReq);
                setSnackbarObj(
                    {
                        backgroundColor: "gold",
                        text: "you dislike post"
                    }
                );
                return setOpen(true);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }

    // load comments on post
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
                setNewComment("");
                setCreateCommentOn(!isCreateCommentOn);
                setFlag(++flagForReq);
                setSnackbarObj(
                    {
                        backgroundColor: "green",
                        text: "You commented on Post"
                    }
                );
                return setOpen(true);
            })
            .catch((err) => {
                setFlag(++flagForReq);
                console.log(err);
                setSnackbarObj(ErrorObject);
                return setOpen(true);
            })
    }
    // deletion of comment
    function deleteComment(e, idOfComment, idOfCommentorReal) {
        // check user logged or not
        if (!LoggedUser._id) {
            setSnackbarObj(ErrorObject);
            return setOpen(true);
        }
        // commentor id and Logged user is same or not
        if (LoggedUser._id !== idOfCommentorReal) {
            setSnackbarObj(
                {
                    backgroundColor: "red",
                    text: "your not owner of comment so you will not able to delete it"
                }
            );
            return setOpen(true);
        }
        // delete comment
        const payload = {
            idOfPost: props.val._id,
            idOfComment: idOfComment,
            idOfCommentor: LoggedUser._id
        }
        const urlForRemoveComment = "/api/post/comment/remove";
        axios.post(urlForRemoveComment, payload)
            .then((data) => {
                setFlag(++flagForReq);
                setCommentButton(false);
                setSnackbarObj(
                    {
                        backgroundColor: "red",
                        text: "Comment Removed"
                    }
                );
                return setOpen(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            <div className="container-center-all mx-3 my-4">
                <div className="card b-radius-card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3 container-center-all">
                                <img src={props.val.postedBy.PicUrl} className="user-post-small-pic" alt="profile-pic"></img>
                            </div>
                            <div className="col-6 d-flex align-item-center">
                                <div className="text-truncate">
                                    <NavLink className="navlink-post-profile" exact to={`/profile/${props.val.postedBy._id}`}>
                                        <h6 className="navlink-post-profile mb-0">{props.val.postedBy.username}</h6>
                                    </NavLink>
                                    <p className="full-name-post-profile">{`${props.val.postedBy.fname} ${props.val.postedBy.lname}`}</p>
                                </div>
                            </div>
                            <div className="col-3 container-center-all">
                                <p className="date-post">{moment(props.val.created).format("H:mm a, MMMM Do YYYY")}</p>
                            </div>
                        </div>
                        <div className="container-center-all">
                            <img src={props.val.photo} className="image-post" alt="profile-pic"></img>
                        </div>
                        <div className="image-post m-0">
                            <p className="desc-post text-muted">{props.val.desc}</p>
                        </div>
                        {/* do in production */}
                        {/* like section */}
                        {
                            (props.val.likes.includes(LoggedUser._id))
                                ?
                                <Button onClick={(e) => { removeLike(e, props.val._id) }}>
                                    <Favorite style={{ color: "red" }}></Favorite>
                                    <span className="mx-2">
                                        {props.val.likes.length}
                                    </span>
                                </Button>
                                : <Button onClick={(e) => { addLike(e, props.val._id) }}>
                                    <FavoriteBorder></FavoriteBorder>
                                    <span className="mx-2">
                                        {props.val.likes.length}
                                    </span>
                                </Button>
                        }
                        {/* comment section */}
                        {
                            <Button onClick={(e) => { onCommentButton(e, props.val._id) }}>
                                <ChatBubbleOutline></ChatBubbleOutline>
                                <span className="mx-2">
                                    {props.val.comments.length}
                                </span>
                            </Button>
                        }
                        {/* create comment */}
                        {
                            <Button onClick={(e) => {
                                createCommentButton(e, props.val._id);
                            }}><AddComment></AddComment></Button>
                        }
                        <div className="ml-3">
                            {
                                (commentButton) ?
                                    commentLoading ?
                                        <>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                            </div>
                                        </>
                                        :
                                        commentInfo.map((comment, i) => {
                                            return (
                                                <>
                                                    <div className="p-1 post-box-content-limiter">
                                                        <h6 className="comment-text">{comment.text}</h6>
                                                        <div className="row justify-content-between">
                                                            <div className="col">
                                                                <NavLink className="comment-username text-muted" exact to={`profile/${comment.postedBy._id}`}>
                                                                    <p className="m-0">{comment.postedBy.username}</p>
                                                                </NavLink>
                                                                <p className="date-post text-muted m-0">{moment(comment.created).format("H:mm a, MMMM Do YYYY")}</p>
                                                            </div>
                                                            <div className="col">
                                                                {
                                                                    LoggedUser._id === comment.postedBy._id ?
                                                                        <button className="btn" onClick={(e) => {
                                                                            deleteComment(e, comment._id, comment.postedBy._id)
                                                                        }}>
                                                                            <Delete style={{ color: "red", fontSize: "0.8rem" }}></Delete>
                                                                        </button> : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    : null
                            }
                        </div>
                        <div className="comment-box">
                            {
                                (isCreateCommentOn) ?
                                    <>
                                        <input className="comment-input-field" type="text" onChange={newCommentHandle} value={newComment}></input>
                                        <Button onClick={(e) => {
                                            addNewComment(e, props.val._id);
                                        }} ><Send></Send></Button>
                                    </>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default SinglePost;
