import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"
import { useHistory } from "react-router";
import PublicPost from "./PublicPost";
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ReactLoading from "react-loading"

const PublicProfile = () => {
    // instances
    let history = useHistory();
    let params = useParams();
    // getting current user
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    if (LoggedUser._id === params.id) {
        history.push("/profile");
    }

    // data
    // main loading for whole page
    let [isLoading, setLoading] = useState(false);
    // public user data
    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: ""
    });
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    // followers and following list of an user
    let [followers, setFollowers] = useState([]);
    let [following, setFollowing] = useState([]);

    // is follow mechanism
    let [loadingFollow, setLoadingFollow] = useState(true);//loading to check user already followed or not
    let [isFollow, setIsFollow] = useState(false);//flag for follow unfollow
    let [flagForReq, setFlag] = useState(0);
    let [reloadForUseEffect, setReload] = useState(1);
    // posts my
    let [loadingPost, setLoadingPost] = useState(false);
    let [myPosts, setMyPosts] = useState([]);

    // lifecycles
    // useEffect for getting basic user info
    useEffect(() => {
        setLoading(true);
        const urlPublicUser = "/api/user/public-profile";
        const body = {
            id: params.id
        };
        axios.post(urlPublicUser, body)
            .then((data) => {
                setAllCurrentData(data.data);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }, []);
    // here we useEffect on reloadFor every time we do follow or unfollw the user so it is real time
    useEffect(() => {
        // fetching follwers and following
        const urlForFollower = "/api/follow/followers/all";
        const urlForFollowing = "/api/follow/following/all";
        const followBody = {
            userId: params.id
        };
        axios.post(urlForFollower, followBody)
            .then((data) => {
                // for getting follwers we also do check for is user alreasdy followed or not
                setFollowers(data.data.followers);
                if (!isEmpty(LoggedUser) && data.data.followers.some(e => e._id === LoggedUser._id)) {
                    setIsFollow(true);
                }
                else {
                    setIsFollow(false);
                }
                setLoadingFollow(false);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
        axios.post(urlForFollowing, followBody)
            .then((data) => {
                setLoading(false);
                setFollowing(data.data.following);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
    }, [reloadForUseEffect])
    useEffect(() => {
        setLoadingPost(true);
        const urlForPosts = "/api/post/public-user-posts";
        const payload = {
            id: params.id
        };
        axios.post(urlForPosts, payload)
            .then((data) => {
                setMyPosts(data.data);
                setLoadingPost(false);
            })
            .catch((err) => {
                console.log(err);
                setLoadingPost(false);
            })

    }, [flagForReq])


    /**
     * Methods
     */
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    // this function will helps us to check is user object is empty due to refreshing of the user
    function isEmpty(obj) {
        return (Object.entries(obj).length === 0 && obj.constructor === Object)
    }
    // for unfollow we does not need do any check cause unfollow button only see if user exists in follwers list
    function UnFollowUser(e, PublicUserId) {
        let token = localStorage.getItem("token");
        const body = {
            token: token,
            userReceive: PublicUserId
        };
        const urlForUnFollowUser = "/api/follow/following/remove"
        axios.post(urlForUnFollowUser, body)
            .then((data) => {
                setReload(reloadForUseEffect + 1);
                setSnackbarObj({ text: "Succefully Unfollow User", backgroundColor: "green" });
                setOpen(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    // for follow we always recheck is user already follow this public profile or not
    function FollowUser(e, PublicUserId) {
        let token = localStorage.getItem("token");
        // logged user is empty means user either not signed in or signed in and refresh the page
        if (!isEmpty(LoggedUser)) {
            setIsFollow(true);
        }
        else {
            setSnackbarObj({ text: "Your not LoggedIn", backgroundColor: "red" });
            setOpen(true);
            return 0;
        }

        const body = {
            token: token,
            userReceive: PublicUserId
        };
        const urlForFollowUser = "/api/follow/following/add"
        axios.post(urlForFollowUser, body)
            .then((data) => {
                setReload(++reloadForUseEffect + 1);
                setSnackbarObj({ text: "Succefully Follow User", backgroundColor: "green" });
                setOpen(true);
            })
            .catch((err) => {
                alert(err);
                console.log(err);
            });

    }
    // this function will detect the change of flagForReqstate in child class
    function handleChangeInPost(flagForReqFromState) {
        setFlag(flagForReqFromState);
    }

    return (
        <>
            {
                isLoading ?
                    <>
                        <div className="container-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <div className="row">
                        <div className="col-12 col-md-6 container-center-all">
                            <img className="profile-pic-main mt-3 mt-md-0 shadow-sm" src={allCurrentData.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                        </div>
                        <div className="col-12 col-md-6 p-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="text-center">
                                        <h3 className="mb-0">{allCurrentData.username}</h3>
                                        <p className="text-muted">{allCurrentData.fname} {allCurrentData.lname}</p>
                                        <p className="px-4">{allCurrentData.about}</p>
                                    </div>

                                    <div className="my-3 text-center">
                                        {
                                            loadingFollow ?
                                                <>
                                                    <div className="container-center-all">
                                                        <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                                    </div>
                                                </>
                                                :
                                                isFollow ?
                                                    <button className="btn btn-default" onClick={(e) => {
                                                        UnFollowUser(e, allCurrentData._id)
                                                    }}>Unfollow</button>
                                                    : <button className="btn btn-outline-default" onClick={(e) => { FollowUser(e, allCurrentData._id) }}>Follow</button>

                                        }
                                        <NavLink to="/messages" className="decoration-none">
                                            <button className="btn btn-outline-primary mx-3">
                                                Message
                                            </button>
                                        </NavLink>
                                    </div>
                                    <div className="row">
                                        <a className="col-4 profile-info-stat" href="#profileMyPostContainer"><span> {myPosts.length}</span> Posts</a>
                                        <NavLink className="col-4 profile-info-stat" exact to={`/profile/${params.id}/followers/`}>
                                            <p>
                                                <span>
                                                    {followers.length}
                                                </span>
                                                Followers
                                            </p>
                                        </NavLink>
                                        <NavLink className="col-4 profile-info-stat" exact to={`/profile/${params.id}/following/`}>
                                            <p>
                                                <span> {following.length}</span>
                                                Following
                                            </p>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }

            {/* post */}
            <div id="profileMyPostContainer">
                {
                    loadingPost ?
                        <>
                            <div className="container-center-all">
                                <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                            </div>
                        </>
                        :
                        myPosts.map((val, i) => {
                            return (
                                <>
                                    <PublicPost val={val} key={val.id} handleChangeInPost={handleChangeInPost}></PublicPost>
                                </>
                            )
                        })
                }
            </div>
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default PublicProfile;