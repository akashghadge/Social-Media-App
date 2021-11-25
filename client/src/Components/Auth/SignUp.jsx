import React, { useState } from "react"
import { useHistory } from "react-router-dom"
// 	https://api.cloudinary.com/v1_1/asghadge
import ReactLoading from "react-loading"
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import http from "../../helper/http"
const SignUp = () => {
    let history = useHistory();
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    let [isLoading, setLoading] = useState(false);
    let [photo, setPhoto] = useState(null);
    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: ""
    });


    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    function inputChange(event) {
        const { id, value } = event.target
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [id]: value
            }
        })
    }
    function picChange(url) {
        const id = "PicUrl";
        const value = url;
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [id]: value
            }
        })
    }
    function fileInputChange(e) {
        setPhoto(e.target.files[0]);
    }
    function isError() {
        if (allCurrentData.fname.length < 3 || allCurrentData.lname.length < 3) {
            setSnackbarObj({
                text: "First and Last Name min have 3 letters", backgroundColor: "red"
            });
            setOpen(true);
            return true;
        }
        else if (allCurrentData.username.length < 6 || allCurrentData.password.length < 6) {
            setSnackbarObj({
                text: "Username and password have min 6 letters", backgroundColor: "red"
            });
            setOpen(true);
            return true;
        }
        return false;
    }
    function getFormData() {
        let formdata = new FormData();
        formdata.append("file", photo);
        formdata.append("upload_preset", "social-media");
        formdata.append("cloud_name", "asghadge");
        return formdata;
    }
    function SendUser() {
        if (isError())
            return;
        let formdata = getFormData();
        http.PostImage(formdata)
            .then((res) => res.json())
            .then((data) => {
                picChange(data.url);
                http.CreateUser(allCurrentData)
                    .then(() => {
                        history.push("/profile");
                    })
                    .catch(() => {
                        setSnackbarObj({ text: "Error Occured", backgroundColor: "red" });
                        setOpen(true);
                    })
            })
            .catch(() => {
                setSnackbarObj({ text: "Error Occured", backgroundColor: "red" });
                setOpen(true);
            })
    }


    return (
        <>
            <div className="container">
                <h1 className="heading-auth mt-2 mb-4">Sign Up</h1>
                <div className="row">
                    <div className="col-12 col-md-6 px-1">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="fname" placeholder="john" value={allCurrentData.fname} onChange={inputChange} required></input>
                            <label htmlFor="fname" >First name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="email" placeholder="john@example.com" style={{ boxShadow: "none" }} onChange={inputChange} value={allCurrentData.email} required></input>
                            <label htmlFor="email" style={{ marginRight: "1.4rem" }}>Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" placeholder="*" id="password" onChange={inputChange} style={{ boxShadow: "none" }} value={allCurrentData.password} required></input>
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 px-1">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="lname" placeholder="doe" value={allCurrentData.lname} onChange={inputChange} style={{ boxShadow: "none" }} required></input>
                            <label htmlFor="lname" >Last name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="username" placeholder="akash@3" style={{ boxShadow: "none" }} onChange={inputChange} value={allCurrentData.username} required></input>
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ProfilePic" class="upload-box-auth mt-2">
                                Upload
                            </label>
                            <input type="file" id="ProfilePic" className="upload-box-auth" onChange={fileInputChange} accept="image/*">
                            </input>
                            <span className="text-sm text-muted">Profile Picture</span>
                        </div>
                    </div>
                </div>
                {
                    (isLoading) ?
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div> :
                        <div className="d-flex justify-content-center mb-3">
                            <button className="btn btn-default d-block w-50" onClick={SendUser}>Create Account</button>
                        </div>
                }
            </div>
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default SignUp;
