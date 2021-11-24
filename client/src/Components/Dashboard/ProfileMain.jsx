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
                        <div className="container-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </> :

                    <div className="row">
                        <div className="col-12 col-md-6 container-center-all">
                            <img className="profile-pic-main mt-3 mt-md-0" src={allCurrentData.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                        </div>
                        <div className="col-12 col-md-6 p-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="text-center">
                                        <h3 className="mb-0">{allCurrentData.username}</h3>
                                        <p className="text-muted mb-0">{allCurrentData.fname} {allCurrentData.lname}</p>
                                        <p className="">{allCurrentData.email}</p>
                                        <p className="px-4">{allCurrentData.about}</p>
                                        <div className="row">
                                            <a className="col-4 profile-info-stat" href="#profileMyPostContainer"><span> {myPosts.length}</span> Posts</a>
                                            <NavLink className="col-4 profile-info-stat" exact to={`/profile/${allCurrentData._id}/followers/`}>
                                                <p>
                                                    <span>
                                                        {followers.length}
                                                    </span>
                                                    Followers
                                                </p>
                                            </NavLink>
                                            <NavLink className="col-4 profile-info-stat" exact to={`/profile/${allCurrentData._id}/following/`}>
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
                            return <MyPost val={val} key={val._id} handleChangeInPost={handleChangeInPost}></MyPost>
                        })
                }
            </div>
        </>
    )
}
export default ProfileMain;
