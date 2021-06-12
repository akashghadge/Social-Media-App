import React, { useState, useEffect } from "react"
import axios from "axios";
const ProfileMain = () => {
    // setting loading true when we request add new  in database
    let [isLoading, setLoading] = useState(false);

    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: ""
    });
    console.log(allCurrentData);
    useEffect(() => {
        setLoading(true);
        let token = localStorage.getItem("token");
        const urlProfileDetails = "http://localhost:5000/api/dashboard/profile";
        axios.post(urlProfileDetails, { token: token })
            .then((data) => {
                console.log(data);
                setAllCurrentData(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }, []);


    return (
        <>
            {
                isLoading ? <h1>Loading ..... </h1> :
                    <div>
                        <img src={allCurrentData.PicUrl} alt="profile-pic"></img>
                        <h1>First Name :{allCurrentData.fname}</h1>
                        <h1>First Name :{allCurrentData.lname}</h1>
                        <h1>First Name :{allCurrentData.email}</h1>
                        <h1>First Name :{allCurrentData.username}</h1>
                    </div>
            }
        </>
    )
}
export default ProfileMain;
