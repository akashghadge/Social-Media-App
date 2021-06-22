import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { NavLink } from "react-router-dom";

const Following = () => {
    let [isLoading, setLoading] = useState(false);
    const params = useParams();
    let [following, setFollowing] = useState([]);
    useEffect(() => {
        const urlForFollowing = "http://localhost:5000/api/follow/following/all"; const followBody = {
            userId: params.id
        };
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
            <h1>Following</h1>
            {
                isLoading ? <p>loading...</p> :
                    (following.length === 0) ? <h1>No Following are here</h1>
                        :
                        <>
                            {
                                following.map((val, i) => {
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
export default Following;
