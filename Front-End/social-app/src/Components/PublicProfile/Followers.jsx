import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";

const Followers = () => {
    let [isLoading, setLoading] = useState(false);
    let [followers, setFollowers] = useState([]);
    const params = useParams();

    useEffect(() => {
        const urlForFollower = "http://localhost:5000/api/follow/followers/all";
        const followBody = {
            userId: params.id
        };
        axios.post(urlForFollower, followBody)
            .then((data) => {
                console.log(data);
                setFollowers(data.data.followers);
                console.log(data.data.followers);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
    }, []);
    return (
        <>
            <h1>Followers</h1>
            {
                (followers.length === 0) ? <h1>No Followers are here</h1>
                    :
                    <>
                        {
                            followers.map((val, i) => {
                                return <NavLink exact to={`/profile/${val._id}/`}>
                                    <h1>{val.username}</h1>
                                </NavLink>
                            })
                        }
                    </>
            }
        </>
    )
}
export default Followers;
