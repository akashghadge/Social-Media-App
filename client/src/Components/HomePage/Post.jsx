import React, { useState, useEffect } from "react"
import SinglePost from "./SinglePost"
import http from "../../helper/http";

const Post = (props) => {
    let [totalPosts, setTotalPosts] = useState([]);
    // for storing state if state change we need to fetch info again so we show user latest info only
    let [flagForReq, setFlag] = useState(0);

    useEffect(async () => {
        let allpost = await http.getAllPosts();
        setTotalPosts(allpost)
    }, [flagForReq]);
    // sort feature when props changes
    useEffect(() => {
        const temp = [...totalPosts];
        if (props.sortBy === 'date-sort') {
            temp.sort(function (a, b) {
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
