import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
import moment from "moment"
import { Favorite, FavoriteBorder, ChatBubbleOutline, AddComment, Send, DeleteForeverOutlined, Delete } from "@material-ui/icons"
import { Button } from "@material-ui/core"
import ReactLoading from "react-loading"
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
                setSnackbarObj(
                    {
                        backgroundColor: "red",
                        text: "Please Logged in Again"
                    }
                );
                return setOpen(true);
            })
    }
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
            })
    }
    // deletee the post
    function deletePost(e) {
        const urlForDeletePost = `/api/post/delete/${props.val._id}`
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
        const urlForRemoveComment = "/api/post/comment/remove";
        axios.post(urlForRemoveComment, payload)
            .then((data) => {
                setFlag(++flagForReq);
                setSnackbarObj(
                    {
                        backgroundColor: "red",
                        text: "Comment Removed"
                    }
                );
                setCommentButton(false)
                return setOpen(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <>
            <div className="postContainer">
                <div className="singlePost">
                    <div className="singlePostHeading">
                        <div className="singlePostHeadingColunm1">
                            <img src={props.val.postedBy.PicUrl} className="singlePostUserPic"></img>
                        </div>
                        <div className="singlePostHeadingColunm2">
                            <NavLink className="singlePostUsername" exact to={`profile/${props.val.postedBy._id}`}>
                                <h3 className="singlePostUsername">{props.val.postedBy.username}</h3>
                            </NavLink>
                            <p className="singlePostName">{`${props.val.postedBy.fname} ${props.val.postedBy.lname}`}</p>
                        </div>
                    </div>
                    <hr></hr>
                    <img src={props.val.photo} className="singlePostImage" width="100px" height="100px" alt="profile-pic"></img>
                    <h3 className="singlePostDesc">{props.val.desc}</h3>
                    {/* do in production */}
                    {/* created time */}
                    <p className="singlePostDate">{moment(props.val.created).format("H:mm a, MMMM Do YYYY")}</p>
                    {/* like section */}
                    {
                        (props.val.likes.includes(LoggedUser._id))
                            ?
                            <Button onClick={(e) => { removeLike(e, props.val._id) }}> <Favorite style={{ color: "red" }}></Favorite>:{props.val.likes.length}</Button> :
                            <Button onClick={(e) => { addLike(e, props.val._id) }}><FavoriteBorder></FavoriteBorder> :{props.val.likes.length}</Button>
                    }
                    {/* comment section */}
                    {
                        <Button onClick={(e) => {
                            onCommentButton(e, props.val._id)
                        }}> <ChatBubbleOutline></ChatBubbleOutline>: {props.val.comments.length}</Button>
                    }
                    {/* create comment */}
                    {
                        <Button onClick={(e) => {
                            createCommentButton(e, props.val._id);
                        }}><AddComment></AddComment></Button>
                    }
                    <div className="singlePostCommentsCollection">
                        {

                            (commentButton) ?
                                commentLoading ? <>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                    </div>
                                </> :
                                    commentInfo.map((comment, i) => {
                                        return (
                                            <>
                                                <div className="singlePostSingleComment">
                                                    <h3 className="singlePostCommentText">{comment.text}</h3>
                                                    <NavLink className="singlePostCommentUsername" exact to={`profile/${comment.postedBy._id}`}>
                                                        <p>{comment.postedBy.username}</p>
                                                    </NavLink>
                                                    <p className="singlePostCommentDate">{moment(comment.created).format("H:mm a, MMMM Do YYYY")}</p>
                                                    <Button onClick={(e) => {
                                                        deleteComment(e, comment._id, comment.postedBy._id)
                                                    }}><Delete style={{ color: "red", fontSize: "0.8rem" }}></Delete></Button>
                                                </div>
                                            </>
                                        )
                                    })
                                : null
                        }
                    </div>
                    <div className="singlePostCommentBox">
                        {
                            (isCreateCommentOn) ?
                                <>
                                    <input className="singlePostCommentInput" type="text" onChange={newCommentHandle} value={newComment}></input>
                                    <Button onClick={(e) => {
                                        addNewComment(e, props.val._id);
                                    }} ><Send></Send></Button>
                                </>
                                : null
                        }
                    </div>
                    {/* delete post */}
                    <button className="deletePostMyPosts" onClick={deletePost}>Delete</button>
                </div>
            </div>
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default SinglePost;
