import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom";
import axios from "axios";
// redux
import { useDispatch, useSelector } from "react-redux";
import saveUser from "../../actions/saveUser"
import { NavLink } from "react-router-dom";
import MyPost from "./MyPost"
import { fade, makeStyles } from '@material-ui/core/styles';
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ReactLoading from "react-loading"
const useStyles = makeStyles((theme) => ({
    profileButtonFollow: {
        color: "purple",
        backgroundColor: "#ffaaff",
        '&:hover': {
            color: "white",
            backgroundColor: "#ff88ff",
        },
    }

}));
const ProfileMain = () => {
    const classes = useStyles();
    // console.log(LoggedUser);
    const dispatch = useDispatch();
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    // history hook
    let history = useHistory();
    // setting loading true when we request add new  in database
    let [isLoading, setLoading] = useState(false);
    let [followers, setFollowers] = useState([]);
    let [following, setFollowing] = useState([]);

    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: ""
    });
    // this function will detect the change of flagForReqstate in child class
    let [flagForReq, setFlag] = useState(0);

    function handleChangeInPost(flagForReqFromState) {
        setFlag(flagForReqFromState);
    }
    // posts my
    let [myPosts, setMyPosts] = useState([]);
    let [loadingPost, setLoadingPost] = useState(false);
    useEffect(() => {
        setLoading(true);
        let token = localStorage.getItem("token");
        const urlProfileDetails = "/api/dashboard/profile";
        axios.post(urlProfileDetails, { token: token })
            .then((data) => {
                console.log(data);
                setAllCurrentData(data.data);
                setFollowers(data.data.followers);
                setFollowing(data.data.following);
                // redux storing the user for all usecases
                dispatch(saveUser(data.data));
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                history.push("/sign");
            })

    }, []);

    useEffect(() => {
        setLoadingPost(true);
        let token = localStorage.getItem("token");
        const urlForPosts = "/api/post/myposts";
        const payload = {
            token: token
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
    return (
        <>
            {
                isLoading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </> :

                    <div className="profile-div-main">
                        <div className="profile-div-col-1">
                            <img className="profile-pic-main" src={allCurrentData.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                        </div>
                        <div className="profile-div-col-2">
                            <h1 className=" ">{allCurrentData.username}</h1>
                            <p className="">{allCurrentData.fname} {allCurrentData.lname}</p>
                            <p className="">{allCurrentData.email}</p>
                            <p className="">{allCurrentData.about}</p>
                            <div className="profile-links-container">
                                <a className="profile-link" href="#profileMyPostContainer">{myPosts.length} Posts</a>
                                <NavLink className="profile-link" exact to={`/profile/${allCurrentData._id}/followers/`}>
                                    <p>{followers.length} Followers</p>
                                </NavLink>
                                <NavLink className="profile-link" exact to={`/profile/${allCurrentData._id}/following/`}>
                                    <p>{following.length} Following</p>
                                </NavLink>
                            </div>
                        </div>
                    </div>
            }
            <hr style={{ width: "90%", margin: "auto", marginBottom: "1rem", marginTop: "1rem" }}></hr>
            <div id="profileMyPostContainer">
                {/* post */}
                {
                    loadingPost ?
                        <>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                            </div>
                        </>
                        :
                        myPosts.map((val, i) => {
                            return <MyPost val={val} key={i} handleChangeInPost={handleChangeInPost}></MyPost>
                        })
                }
            </div>
        </>
    )
}
export default ProfileMain;
