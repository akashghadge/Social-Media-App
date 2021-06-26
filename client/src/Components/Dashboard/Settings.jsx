import React, { useEffect, useState } from "react"
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Save } from "@material-ui/icons";
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ReactLoading from "react-loading"
import { NavLink } from "react-router-dom";
import { Button } from "@material-ui/core";
const Settings = () => {
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
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
        const urlProfileDetails = "/api/dashboard/profile-edit";
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

    let [photo, setPhoto] = useState(null);
    function fileInputChange(e) {
        setPhoto(e.target.files[0]);
    }
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
    console.log(allCurrentData);
    function updateUser(e) {
        if (allCurrentData.fname.length < 3 || allCurrentData.lname.length < 3) {
            setSnackbarObj({ text: "First and Last name must have atleast 3 letters", backgroundColor: "red" });
            setOpen(true);
        }
        else {

            setLoading(true);
            const urlUpdateUser = "/api/dashboard/edit";
            const updateData = {
                id: allCurrentData._id,
                update: allCurrentData,
                token: token
            };
            axios.post(urlUpdateUser, updateData)
                .then((data) => {
                    console.log(data);
                    setSnackbarObj({ text: "Profile Updated", backgroundColor: "green" });
                    setOpen(true);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setSnackbarObj({ text: "No Update", backgroundColor: "red" });
                    setOpen(true);
                    setLoading(false);
                })
        }
    }
    const [loadingImg, setLoadingImg] = useState(false);
    function uploadImage(e) {
        const urlUploadCloud = "https://api.cloudinary.com/v1_1/asghadge/image/upload";
        let formdata = new FormData();
        formdata.append("file", photo);
        formdata.append("upload_preset", "social-media");
        formdata.append("cloud_name", "asghadge");
        setLoadingImg(true);
        fetch(urlUploadCloud,
            {
                method: "post",
                body: formdata
            })
            .then((res) => res.json())
            .then((data) => {
                const urlUpdateUser = "/api/dashboard/edit-dp";
                const updateData = {
                    id: allCurrentData._id,
                    update: { PicUrl: data.url },
                    token: token
                };
                axios.post(urlUpdateUser, updateData)
                    .then((data) => {
                        console.log(data);
                        setSnackbarObj({ text: "Profile Updated", backgroundColor: "green" });
                        setLoadingImg(false);
                        setOpen(true);
                    })
                    .catch((err) => {
                        console.log(err);
                        setSnackbarObj({ text: "No Update", backgroundColor: "red" });
                        setOpen(true);
                        setLoadingImg(false);
                    })

            }).
            catch((err) => {
                setLoadingImg(false);
                console.log(err);
            })
    }
    return (
        <>
            <h1 className="settingMainHeading">Settings</h1>
            {
                isLoading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <>
                        <div style={{ textAlign: "center", margin: "1rem" }}>
                            <label for="postPic" class="createPostInputFile">
                                Upload Here
                            </label>
                            <input type="file" id="postPic" className="createPostInputFile" onChange={fileInputChange} accept="image/*">
                            </input>
                            <br></br>
                            {
                                loadingImg ?
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                    </div>
                                    :
                                    <button style={{ margin: "1rem" }} className="submitButton" onClick={uploadImage}>Send Image</button>
                            }
                        </div>
                        <div className="settingContainer">
                            <div className="settingContainerChild">
                                <span className="settingText">First Name :</span>
                                <input type="text" id="fname" className="settingInputFields" value={allCurrentData.fname} onChange={inputChange}></input>
                                <br></br>
                                <span className="settingText">Last Name :</span>
                                <input type="text" id="lname" className="settingInputFields" value={allCurrentData.lname} onChange={inputChange}></input>
                                <br></br>
                                <span className="settingText" style={{ margin: "1rem" }}>About :</span>
                                <input type="text" id="about" className="settingInputFields" value={allCurrentData.about} onChange={inputChange}></input>
                                <br></br>
                                <br></br>
                                {/* 
                        <input type="password" id="password" value={allCurrentData.password} onChange={inputChange}></input>
                        <br></br> */}
                                <button className="submitButton" onClick={updateUser}><Save></Save></button>
                                <br></br>
                                <NavLink className="settingNavLink" to="/forget-password">For changing password please click here</NavLink >
                            </div>
                        </div>
                    </>
            }
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default Settings;
