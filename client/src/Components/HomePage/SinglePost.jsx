// basic react imports
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Favorite, FavoriteBorder, ChatBubbleOutline, AddComment, Send, Delete } from "@material-ui/icons"
import { Button } from "@material-ui/core"
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import http from "../../helper/http"
import SinglePostHead from "./SinglePostHead"
import SinglePostComments from "./SinglePostComments"

const SinglePost = (props) => {
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    
    // Data
    let [open, setOpen] = useState(false);
    let [snackbarObj, setSnackbarObj] = useState({ text: "hello world", backgroundColor: "black" });
    const ErrorObject = { backgroundColor: "red", text: "Your Not Loggedin" }
    // flag for sending signal to relaod post data
    let [flagForReq, setFlag] = useState(0);
    let [showCommentButton, setShowCommentButton] = useState(false);
    let [commentInfo, setCommentInfo] = useState("");
    let [commentLoading, setCommentLoading] = useState(false);
    let [isCreateCommentOn, setCreateCommentOn] = useState(false);
    let [newComment, setNewComment] = useState("");

    // lifecycle hook
    useEffect(() => {
        props.handleChangeInPost(flagForReq);
    }, [flagForReq]);

    // methods
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    function isLoggedIn() {
        return !LoggedUser._id;
    }
    function createCommentButton(e, id) {
        setCreateCommentOn(!isCreateCommentOn);
    }
    function newCommentHandle(e, idOfPost) {
        setNewComment(e.target.value);
    }
    function AlreadyLiked() {
        return props.val.likes.includes(LoggedUser._id);
    }
    function closeCommentBox() {
        setFlag(++flagForReq);
        setShowCommentButton(false);
    }
    const addLike = (event, idPost) => {
        if (isLoggedIn()) {
            setSnackbarObj(ErrorObject);
            return setOpen(true);
        }
        const payload = {
            token: localStorage.getItem('token'),
            idOfPost: idPost
        };
        http.AddLike(payload)
            .then(() => {
                setFlag(++flagForReq);
                setSnackbarObj({
                    backgroundColor: "green",
                    text: "You Liked Post"
                });
                setOpen(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const removeLike = (event, idPost) => {
        if (isLoggedIn()) {
            setSnackbarObj(ErrorObject);
            return setOpen(true);
        }
        const payload = {
            token: localStorage.getItem('token'),
            idOfPost: idPost
        };
        http.RemoveLike(payload)
            .then(() => {
                setFlag(++flagForReq);
                setSnackbarObj({
                    backgroundColor: "purple",
                    text: "You dislike post"
                });
                setOpen(true);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }

    async function onCommentButton(e, postId) {
        setShowCommentButton(!showCommentButton);
        setCommentLoading(true);
        const body = { idOfPost: postId };
        let comments = await http.getComments(body);
        setCommentInfo(comments);
        setCommentLoading(false);
    }


    function addNewComment(e, idOfPost) {
        if (newComment.length === 0) {
            snackbarObj({ backgroundColor: "red", text: "Empty Text !!!" });
            return setOpen(true);
        }
        const payload = {
            token: localStorage.getItem('token'),
            idOfPost: idOfPost,
            text: newComment
        };
        http.AddComment(payload)
            .then(() => {
                setNewComment("");
                setCreateCommentOn(!isCreateCommentOn);
                setShowCommentButton(false);
                setFlag(++flagForReq);
                setSnackbarObj({ backgroundColor: "green", text: "You commented on Post" });
                setOpen(true);
            })
            .catch((err) => {
                setFlag(++flagForReq);
                setSnackbarObj(ErrorObject);
                setOpen(true);
            })
    }
    return (
        <>
            <div className="container-center-all mx-3 my-4">
                <div className="card b-radius-card">
                    <div className="card-body">
                        {/* heading of Post */}
                        <SinglePostHead val={props.val} />

                        {/* phot and description */}
                        <div className="container-center-all">
                            <img src={props.val.photo} className="image-post" alt="profile-pic"></img>
                        </div>
                        <div className="image-post m-0">
                            <p className="desc-post text-muted">{props.val.desc}</p>
                        </div>

                        {/* like section */}
                        {(AlreadyLiked()) ?
                            <Button onClick={(e) => { removeLike(e, props.val._id) }}>
                                <Favorite className="text-danger"></Favorite>
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
                        <Button onClick={(e) => { onCommentButton(e, props.val._id) }}>
                            <ChatBubbleOutline></ChatBubbleOutline>
                            <span className="mx-2">
                                {props.val.comments.length}
                            </span>
                        </Button>
                        <Button onClick={(e) => { createCommentButton(e, props.val._id) }}>
                            <AddComment></AddComment>
                        </Button>
                        <SinglePostComments LoggedUser={LoggedUser} showCommentButton={showCommentButton} idOfPost={props.val._id} commentLoading={commentLoading} commentInfo={commentInfo} closeCommentBox={closeCommentBox}></SinglePostComments>

                        <div className="container-center-all">
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