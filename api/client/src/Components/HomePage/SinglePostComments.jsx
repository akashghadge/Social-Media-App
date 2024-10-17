import React, { useState } from 'react';
import ReactLoading from "react-loading"
import { DateFormate } from '../../helper/utilities';
import { NavLink } from 'react-router-dom';
import { Delete } from '@material-ui/icons';
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import http from '../../helper/http';

const Singlepostcomments = (props) => {
    let [open, setOpen] = useState(false);
    let [snackbarObj, setSnackbarObj] = useState({ text: "hello world", backgroundColor: "black" });
    function isLoggedIn() {
        return !props.LoggedUser._id;
    }
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    function deleteComment(e, idOfComment, idOfCommentorReal) {
        if (isLoggedIn()) {
            setSnackbarObj({ backgroundColor: "red", text: "Your Not Loggedin" });
            return setOpen(true);
        }
        // commentor id and Logged user is same or not
        if (props.LoggedUser._id !== idOfCommentorReal) {
            setSnackbarObj({ backgroundColor: "red", text: "your not owner of comment so you will not able to delete it" });
            return setOpen(true);
        }
        const payload = {
            idOfPost: props.idOfPost,
            idOfComment: idOfComment,
            idOfCommentor: props.LoggedUser._id
        }
        http.RemoveComment(payload)
            .then(() => {
                props.closeCommentBox();
                setSnackbarObj({ backgroundColor: "red", text: "Comment Removed" });
                setOpen(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <>
            <div className="ml-3">
                {
                    (props.showCommentButton) ?
                        props.commentLoading ?
                            <>
                                <div className="container-center-all">
                                    <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                </div>
                            </>
                            :
                            props.commentInfo.map((comment, i) => {
                                return (
                                    <div key={comment._id} className="p-1 post-box-content-limiter">
                                        <h6 className="comment-text">{comment.text}</h6>
                                        <div className="row justify-content-between">
                                            <div className="col">
                                                <NavLink className="comment-username text-muted" exact to={`profile/${comment.postedBy._id}`}>
                                                    <p className="m-0">{comment.postedBy.username}</p>
                                                </NavLink>
                                                <p className="date-post text-muted m-0">{DateFormate(comment.created)}</p>
                                            </div>
                                            <div className="col">
                                                {
                                                    props.LoggedUser._id === comment.postedBy._id ?
                                                        <button className="btn" onClick={(e) => {
                                                            deleteComment(e, comment._id, comment.postedBy._id)
                                                        }}>
                                                            <Delete className="text-danger btn-custom-sm"></Delete>
                                                        </button> : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        : null
                }
                {/* snackbar */}
                <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                    text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
            </div>
        </>
    );
}

export default Singlepostcomments;
