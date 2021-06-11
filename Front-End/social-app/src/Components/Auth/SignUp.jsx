import React, { useState } from "react"
// import axios from "axios"
import { Save } from "@material-ui/icons"
// 	https://api.cloudinary.com/v1_1/asghadge
// social-media
const SignUp = () => {
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
    let [photo, setPhoto] = useState(null);
    function fileInputChange(e) {
        setPhoto(e.target.files[0]);
    }

    function SendUser(event) {
        setLoading(true);
        const urlUploadCloud = "https://api.cloudinary.com/v1_1/asghadge/image/upload";
        const urlServerUploadUser = "http://localhost:5000/api/user/add";
        let formdata = new FormData();
        formdata.append("file", photo);
        formdata.append("upload_preset", "social-media");
        formdata.append("cloud_name", "asghadge");
        fetch(urlUploadCloud,
            {
                method: "post",
                body: formdata
            })
            .then((res) => res.json())
            .then((data) => {
                const id = "PicUrl";
                const value = data.url;
                setAllCurrentData((prev) => {
                    return {
                        ...prev,
                        [id]: value
                    }
                })
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(allCurrentData)
                };
                fetch(urlServerUploadUser, requestOptions)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log(err)
                        setLoading(false);
                    })
            })
            .catch((err) => {
                console.log(err)
                setLoading(false);
            })
    }


    return (
        <>
            {
                (isLoading) ? <h1>Loading ....</h1> :

                    <div className="">
                        <h1 className="SignHeading">Sign Up</h1>
                        <lable>Profile Photo</lable>
                        <input type="file" id="profilePic" onChange={fileInputChange} accept="image/*"></input>
                        <label >First name</label>
                        <input type="text" className="form-control" id="fname" placeholder="" value={allCurrentData.fname} onChange={inputChange} required style={{ boxShadow: "none" }}></input>
                        <label >Last name</label>
                        <input type="text" className="form-control" id="lname" placeholder="" value={allCurrentData.lname} onChange={inputChange} style={{ boxShadow: "none" }} required></input>
                        <label >Email</label>
                        <input type="email" className="form-control" id="email" placeholder="you@example.com" style={{ boxShadow: "none" }} onChange={inputChange} value={allCurrentData.email} required></input>
                        <label >UserName</label>
                        <input type="text" className="form-control inputFieldSignInUp" id="username" placeholder="akash@3" style={{ boxShadow: "none" }} onChange={inputChange} value={allCurrentData.username} required></input>
                        <label >Password</label>
                        <input type="password" className="form-control inputFieldSignInUp" id="password" onChange={inputChange} style={{ boxShadow: "none" }} value={allCurrentData.password} required></input>

                        <button className="submitButton" onClick={SendUser}><Save></Save></button>
                    </div>
            }
        </>
    )
}
export default SignUp;
