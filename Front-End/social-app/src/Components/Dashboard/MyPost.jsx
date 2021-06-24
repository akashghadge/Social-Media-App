import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
import moment from "moment"
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
const SinglePost = (props) => {
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
            setSnackbarObj(ErrorObject);
            return setOpen(true);
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
                alert(err);
            })
    }
    const removeLike = (event, idPost) => {
        if (!LoggedUser._id) {
            setSnackbarObj(ErrorObject);
            return setOpen(true);
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
            })
    }
    // deletee the post
    function deletePost(e) {
        const urlForDeletePost = `http://localhost:5000/api/post/delete/${props.val._id}`
        axios.post(urlForDeletePost, {})
            .then((data) => {
                console.log(data);
                setFlag(++flagForReq);
                setSnackbarObj(
                    {
                        backgroundColor: "red",
                        text: "Post Deleted"
                    }
                );
                setOpen(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }
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
        const urlForRemoveComment = "http://localhost:5000/api/post/comment/remove";
        axios.post(urlForRemoveComment, payload)
            .then((data) => {
                setFlag(++flagForReq);
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
            <div>
                <img src={props.val.photo} width="100px" height="100px" alt="profile-pic"></img>
                <h3>{props.val.desc}</h3>
                {/* do in production */}
                <NavLink exact to={`profile/${props.val.postedBy._id}`}>
                    <h3>{props.val.postedBy.username}</h3>
                </NavLink>
                {/* created time */}
                <p>{moment(props.val.created).format("H:mm a, MMMM Do YYYY")}</p>
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
                                        <p>{moment(comment.created).format("H:mm a, MMMM Do YYYY")}</p>
                                        <button onClick={(e) => {
                                            deleteComment(e, comment._id, comment.postedBy._id)
                                        }}>Delete Comment</button>
                                        <br></br>
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
                <br></br>
                {/* delete post */}
                <button onClick={deletePost}>Delete</button>
            </div>
            <br></br>
            <br></br>
            <br></br>
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default SinglePost;
