import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom";
import axios from "axios";
// redux
import { useDispatch, useSelector } from "react-redux";
import saveUser from "../../actions/saveUser"
import { NavLink } from "react-router-dom";
import MyPost from "./MyPost"

const ProfileMain = () => {
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
                    <div>
                        <img src={allCurrentData.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                        <h1>First Name :{allCurrentData.fname}</h1>
                        <h1>First Name :{allCurrentData.lname}</h1>
                        <h1>First Name :{allCurrentData.email}</h1>
                        <h1>First Name :{allCurrentData.username}</h1>
                        <NavLink exact to={`/profile/${allCurrentData._id}/followers/`}>
                            <h1>Followers :{followers.length}</h1>
                        </NavLink>
                        <NavLink exact to={`/profile/${allCurrentData._id}/following/`}>
                            <h1>Following :{following.length}</h1>
                        </NavLink>
                    </div>
            }
            {/* post */}
            {
                myPosts.map((val, i) => {
                    return <MyPost val={val} key={i} handleChangeInPost={handleChangeInPost}></MyPost>
                })
            }
        </>
    )
}
export default ProfileMain;
