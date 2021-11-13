import React, { useEffect, useState } from "react"
import axios from "axios";
import { useHistory } from "react-router-dom";
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ForgetPassword from "../Auth/ForgetPassword";
import ReactLoading from "react-loading"
import { NavLink } from "react-router-dom";
import Pagebreadcrumb from "../SmallComponents/PageBreadcrumb";
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
    }
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
    function openSnackBarForgetPassword(flag) {
        if (flag) {
            setSnackbarObj({ text: `Link Send Successfully please check email`, backgroundColor: "green" })
            setOpen(true);
        }
        else {
            setSnackbarObj({ text: `Fail send link please enter valid email`, backgroundColor: "red" })
            setOpen(true);
        }
    }
    return (
        <>
            <Pagebreadcrumb heading="Profile Settings" base="Dashboard" url="profile" />
            {
                isLoading ?
                    <>
                        <div className="container-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <>
                        <div className="container-fluid px-5">
                            <div className="card">
                                <div className="card-body">
                                    <h1 className="heading-auth mt-2 mb-4">Update</h1>
                                    <div>
                                        <div className="row px-2">
                                            <div className="col-12 col-md-6 pr-2">
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="fname" placeholder="john" value={allCurrentData.fname} onChange={inputChange} required></input>
                                                    <label htmlFor="fname" >First name</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <textarea type="text" id="about" className="form-control" value={allCurrentData.about} onChange={inputChange} placeholder="about ..."></textarea>
                                                    <label htmlFor="about" >About</label>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 px-2">
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="lname" placeholder="doe" value={allCurrentData.lname} onChange={inputChange} style={{ boxShadow: "none" }} required></input>
                                                    <label htmlFor="lname" >Last name</label>
                                                </div>
                                                <div className="row text-center text-md-start">
                                                    <div className="col-12  col-md-6 mb-3 mb-md-0">
                                                        <label htmlFor="postPic" className="input-file-dash p-2">
                                                            Upload Here
                                                        </label>
                                                        <input type="file" id="postPic" className="input-file-dash" onChange={fileInputChange} accept="image/*">
                                                        </input>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        {
                                                            loadingImg ?
                                                                <div className="container-center-all">
                                                                    <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                                                </div>
                                                                :
                                                                <button className="btn btn-outline-success" onClick={uploadImage}>Change Image</button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <p className="modal-button text-center d-block" data-bs-toggle="modal" data-bs-target="#forget-modal">
                                        Change Password
                                    </p>
                                    <div class="modal fade" id="forget-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLabel">Change Password</h5>
                                                    <button type="button" class="btn-close btn-outline-danger" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <ForgetPassword openSnackBarForgetPassword={openSnackBarForgetPassword}></ForgetPassword>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center mb-5">
                                        <button className="d-block w-50 btn btn-outline-success" onClick={updateUser}>Update Changes</button>
                                    </div>
                                </div>
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
