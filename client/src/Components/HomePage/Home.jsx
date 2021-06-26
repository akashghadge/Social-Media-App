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
    useEffect(() => {
        let token = localStorage.getItem("token");
        setLoading(true);
        const urlProfileDetails = "http://localhost:5000/api/dashboard/profile";
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

    return (
        <>
            {
                loading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <>
                        <AllUsers></AllUsers>
                        <Post></Post>
                    </>
            }
        </>
    )
}
export default Home;
