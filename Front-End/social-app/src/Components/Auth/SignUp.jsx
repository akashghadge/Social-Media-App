import React, { useState } from "react"
// import axios from "axios"
import { Save } from "@material-ui/icons"
// 	https://api.cloudinary.com/v1_1/asghadge
// social-media
const SignUp = () => {
    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        url: ""
    });
    function inputChange(event) {
        const { id, value } = event.target
        // console.log(id, value);
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [id]: value
            }
        })
    }
    let [photo, setPhoto] = useState("");
    function SendUser(event) { }


    return (
        <>
            <div className="">
                <h1 className="SignHeading">Sign Up</h1>
                <label >First name</label>
                <input type="text" className="form-control inputFieldSignInUp" id="fname" placeholder="" value={allCurrentData.fname} onChange={inputChange} required style={{ boxShadow: "none" }}></input>
                <label >Last name</label>
                <input type="text" className="form-control inputFieldSignInUp" id="lname" placeholder="" value={allCurrentData.lname} onChange={inputChange} style={{ boxShadow: "none" }} required></input>
                <label >Email</label>
                <input type="email" className="form-control inputFieldSignInUp" id="email" placeholder="you@example.com" style={{ boxShadow: "none" }} onChange={inputChange} value={allCurrentData.email} required></input>
                <label >UserName</label>
                <input type="text" className="form-control inputFieldSignInUp" id="username" placeholder="akash@3" style={{ boxShadow: "none" }} onChange={inputChange} value={allCurrentData.username} required></input>
                <label >Password</label>
                <input type="password" className="form-control inputFieldSignInUp" id="password" onChange={inputChange} style={{ boxShadow: "none" }} value={allCurrentData.password} required></input>

                <button className="submitButton" onClick={SendUser}><Save></Save></button>
            </div>
        </>
    )
}
export default SignUp;
