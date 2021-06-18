import React, { useEffect, useState } from "react"
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Save } from "@material-ui/icons";

const Settings = () => {
    let history = useHistory();
    let [isLoading, setLoading] = useState(false);
    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: "",
        _id: ""
    });
    let token = localStorage.getItem("token");
    useEffect(() => {
        setLoading(true);
        const urlProfileDetails = "http://localhost:5000/api/dashboard/profile-edit";
        axios.post(urlProfileDetails, { token: token })
            .then((data) => {
                console.log(data.data);
                setAllCurrentData(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                history.push("/sign");
            })
    }, []);


    // radio varibles
    function inputChange(event) {
        const { id, value } = event.target
        // console.log(id, value);
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [id]: value
            }
        })
        console.log(allCurrentData);
    }
    function updateUser(e) {
        setLoading(true);
        const urlUpdateUser = "http://localhost:5000/api/dashboard/edit";
        const updateData = {
            id: allCurrentData._id,
            update: allCurrentData,
            token: token
        };
        axios.post(urlUpdateUser, updateData)
            .then((data) => {
                console.log(data);
                setLoading(false);
                alert("update succefully")
            })
            .catch((err) => {
                console.log(err);
                alert("no update")
                setLoading(false);
            })
    }
    return (
        <>
            <h1>Settings</h1>
            {
                isLoading ? <h1>Loading ..... </h1> :
                    <div>
                        <input type="text" id="fname" value={allCurrentData.fname} onChange={inputChange}></input>
                        <br></br>

                        <input type="text" id="lname" value={allCurrentData.lname} onChange={inputChange}></input>
                        <br></br>

                        <input type="text" id="username" value={allCurrentData.username} onChange={inputChange}></input>
                        <br></br>
                        {/* 
                        <input type="password" id="password" value={allCurrentData.password} onChange={inputChange}></input>
                        <br></br> */}
                        <button className="submitButton" onClick={updateUser}><Save></Save></button>
                    </div>
            }
        </>
    )
}
export default Settings;
