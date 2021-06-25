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
        const urlProfileDetails = "http://localhost:5000/api/dashboard/profile";
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
        const urlForPosts = "http://localhost:5000/api/post/myposts";
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
                isLoading ? <h1>Loading ..... </h1> :
                    <div className="profileParentDiv">
                        <div className="profileCenterColunm1">
                            <img className="profilePic" src={allCurrentData.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                        </div>
                        <div className="profileCenterColunm2">
                            <h1 className="profileUsername">{allCurrentData.username}</h1>
                            <p className="profileFirstLastName">{allCurrentData.fname} {allCurrentData.lname}</p>
                            <p className="profileEmail">{allCurrentData.email}</p>
                            <p className="profileAbout">{allCurrentData.about}</p>
                            <div className="profileNavlinkContainer">
                                <a className="profileNavlinkPost" href="#profileMyPostContainer">{myPosts.length} Posts</a>
                                <NavLink className="profileNavlink" exact to={`/profile/${allCurrentData._id}/followers/`}>
                                    <h1>{followers.length} Followers</h1>
                                </NavLink>
                                <NavLink className="profileNavlink" exact to={`/profile/${allCurrentData._id}/following/`}>
                                    <h1>{following.length} Following</h1>
                                </NavLink>
                            </div>
                        </div>
                    </div>
            }
            <hr style={{ width: "90%", margin: "auto", marginBottom: "1rem", marginTop: "1rem" }}></hr>
            <div id="profileMyPostContainer">
                {/* post */}
                {
                    myPosts.map((val, i) => {
                        return <MyPost val={val} key={i} handleChangeInPost={handleChangeInPost}></MyPost>
                    })
                }
            </div>
        </>
    )
}
export default ProfileMain;
