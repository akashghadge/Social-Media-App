import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";
const PublicProfile = () => {
    let params = useParams();
    let [isLoading, setLoading] = useState(false);

    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: ""
    });
    let [followers, setFollowers] = useState([]);
    let [following, setFollowing] = useState([]);

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
        const urlForFollower = "http://localhost:5000/api/follow/followers/all";
        const urlForFollowing = "http://localhost:5000/api/follow/following/all";
        const followBody = {
            userId: params.id
        };
        axios.post(urlForFollower, followBody)
            .then((data) => {
                setFollowers(data.data.followers);
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
    }, []);


    return (
        <>
            {
                isLoading ? <h1>Loading ..... </h1> :
                    <div>
                        <img src={allCurrentData.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                        <h1>Username :{allCurrentData.username}</h1>
                        <NavLink exact to={`/profile/${params.id}/followers/`}>
                            <h1>Followers :{followers.length}</h1>
                        </NavLink>
                        <NavLink exact to={`/profile/${params.id}/following/`}>
                            <h1>Following :{following.length}</h1>
                        </NavLink>
                    </div>
            }
        </>
    )
}
export default PublicProfile;
