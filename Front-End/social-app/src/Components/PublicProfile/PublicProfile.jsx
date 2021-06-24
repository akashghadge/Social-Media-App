import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"
import { useHistory } from "react-router";
import PublicPost from "./PublicPost";
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
const PublicProfile = () => {
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
    let params = useParams();
    // getting current user
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    if (LoggedUser._id === params.id) {
        history.push("/profile");
    }
    // this function will helps us to check is user object is empty due to refreshing of the user
    function isEmpty(obj) {
        return (Object.entries(obj).length === 0 && obj.constructor === Object)
    }

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

    // followers and following list of an user
    let [followers, setFollowers] = useState([]);
    let [following, setFollowing] = useState([]);

    // is follow mechanism
    let [loadingFollow, setLoadingFollow] = useState(true);//loading to check user already followed or not
    let [isFollow, setIsFollow] = useState(false);//flag for follow unfollow
    let [flagForReq, setFlag] = useState(0);
    // useEffect for getting basic user info
    useEffect(() => {
        setLoading(true);
        const urlPublicUser = "http://localhost:5000/api/user/public-profile";
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
    let [reloadForUseEffect, setReload] = useState(1);
    useEffect(() => {
        // fetching follwers and following
        const urlForFollower = "http://localhost:5000/api/follow/followers/all";
        const urlForFollowing = "http://localhost:5000/api/follow/following/all";
        const followBody = {
            userId: params.id
        };
        axios.post(urlForFollower, followBody)
            .then((data) => {
                // for getting follwers we also do check for is user alreasdy followed or not
                console.log(data.data);
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

    // for unfollow we does not need do any check cause unfollow button only see if user exists in follwers list
    function UnFollowUser(e, PublicUserId) {
        let token = localStorage.getItem("token");
        const body = {
            token: token,
            userReceive: PublicUserId
        };
        const urlForUnFollowUser = "http://localhost:5000/api/follow/following/remove"
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
            history.push("/profile");
            return 0;
        }

        const body = {
            token: token,
            userReceive: PublicUserId
        };
        const urlForFollowUser = "http://localhost:5000/api/follow/following/add"
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
    // posts my
    let [myPosts, setMyPosts] = useState([]);
    let [loadingPost, setLoadingPost] = useState(false);
    useEffect(() => {
        setLoadingPost(true);
        const urlForPosts = "http://localhost:5000/api/post/public-user-posts";
        const payload = {
            id: params.id
        };
        axios.post(urlForPosts, payload)
            .then((data) => {
                console.log(data);
                setMyPosts(data.data);
                setLoadingPost(false);
            })
            .catch((err) => {
                console.log(err);
                setLoadingPost(false);
            })

    }, [flagForReq])
    // this function will detect the change of flagForReqstate in child class
    function handleChangeInPost(flagForReqFromState) {
        setFlag(flagForReqFromState);
    }

    return (
        <>
            {
                isLoading ? <h1>Loading ..... </h1> :
                    <div>
                        <img src={allCurrentData.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                        <h1>Username :{allCurrentData.username}</h1>
                        {
                            loadingFollow ?
                                <p>....</p> :
                                isFollow ?
                                    <button onClick={(e) => {
                                        UnFollowUser(e, allCurrentData._id)
                                    }}>Unfollow</button>
                                    : <button onClick={(e) => { FollowUser(e, allCurrentData._id) }}>Follow</button>

                        }
                        <NavLink exact to={`/profile/${params.id}/followers/`}>
                            <h1>Followers :{followers.length}</h1>
                        </NavLink>
                        <NavLink exact to={`/profile/${params.id}/following/`}>
                            <h1>Following :{following.length}</h1>
                        </NavLink>
                    </div>
            }
            {/* post */}
            {
                myPosts.map((val, i) => {
                    return <PublicPost val={val} key={i} handleChangeInPost={handleChangeInPost}></PublicPost>
                })
            }
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default PublicProfile;
