import React, { useState, useEffect } from "react"
import axios from "axios"
import SinglePost from "./SinglePost"
const Post = () => {
    //for storing all fetch post data
    let [totalPosts, setTotalPosts] = useState([]);
    // for storing state if state change we need to fetch info again so we show user latest info only
    let [flagForReq, setFlag] = useState(0);

    // this will fetch all data when flagForReq is change
    useEffect(() => {
        const urlForAllPost = "http://localhost:5000/api/post/all";
        axios.post(urlForAllPost, {})
            .then((data) => {
                console.log(data.data);
                setTotalPosts(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [flagForReq]);
    // this function will detect the change of flagForReqstate in child class
    function handleChangeInPost(flagForReqFromState) {
        setFlag(flagForReqFromState);
    }

    return (
        <>
            {
                (totalPosts === undefined) ? null : totalPosts.map((val, i, arr) => {
                    return (
                        <>
                            <SinglePost val={val} index={i} handleChangeInPost={handleChangeInPost} ></SinglePost>
                        </>
                    )
                })
            }
        </>
    )
}
export default Post;
