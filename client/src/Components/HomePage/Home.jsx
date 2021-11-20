import React, { useEffect, useState } from "react"
// components
import Post from "./Post";
import AllUsers from "./AllUsers";

import axios from "axios";
// redux
import { useDispatch } from "react-redux";
import saveUser from "../../actions/saveUser"
import ReactLoading from "react-loading"


const Home = () => {
    // redux stuff
    const dispatch = useDispatch();
    let [loading, setLoading] = useState(false);
    let [sortByValue, setSortByValue] = useState("all-sort");
    useEffect(() => {
        let token = localStorage.getItem("token");
        setLoading(true);
        const urlProfileDetails = "/api/dashboard/profile";
        axios.post(urlProfileDetails, { token: token })
            .then((data) => {
                // redux storing the user for all usecases
                setLoading(false);
                dispatch(saveUser(data.data));
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
    }, []);

    function sortChange(e) {
        setSortByValue(e.target.id);
    }

    return (
        <>
            {
                loading ?
                    <>
                        <div className="container-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <>
                        <AllUsers></AllUsers>
                        <div className="container-center-all m-0">
                            <hr width="95%"></hr>
                        </div>
                        <div className="d-flex justify-content-between">
                            <h3 className="mx-4 my-2 font-weight-bold">
                                Feeds
                            </h3>
                            <div className="d-flex mx-4 my-2 font-20 cursor-pointer">
                                <p onClick={sortChange} id="all-sort" className={`${sortByValue === "all-sort" ? 'active-feed-type' : ''} mx-1`}>All</p>
                                <p onClick={sortChange} id="top-sort" className={`${sortByValue === "top-sort" ? 'active-feed-type' : ''} mx-1`}>Top</p>
                                <p onClick={sortChange} id="date-sort" className={`${sortByValue === "date-sort" ? 'active-feed-type' : ''} mx-1`}>Recent</p>
                            </div>
                        </div>
                        <Post sortBy={sortByValue}></Post>
                    </>
            }
        </>
    )
}
export default Home;
