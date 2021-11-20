import React, { useState, useEffect } from "react"
import axios from "axios"
import SinglePost from "./SinglePost"
const Post = (props) => {
    //for storing all fetch post data
    let [totalPosts, setTotalPosts] = useState([]);
    // for storing state if state change we need to fetch info again so we show user latest info only
    let [flagForReq, setFlag] = useState(0);

    // this will fetch all data when flagForReq is change
    useEffect(() => {
        const urlForAllPost = "/api/post/all";
        axios.post(urlForAllPost, {})
            .then((data) => {
                setTotalPosts(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [flagForReq]);

    useEffect(() => {
        const temp = [...totalPosts];
        if (props.sortBy === 'date-sort') {
            temp.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.created) - new Date(a.created);
            });
        }
        else if (props.sortBy === 'top-sort') {
            temp.sort(function (a, b) {
                return b.likes.length - a.likes.length
            })
        }
        setTotalPosts(temp);
    }, [props.sortBy])


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
                            <SinglePost val={val} index={i} key={val._id} handleChangeInPost={handleChangeInPost} ></SinglePost>
                        </>
                    )
                })
            }
        </>
    )
}
export default Post;
