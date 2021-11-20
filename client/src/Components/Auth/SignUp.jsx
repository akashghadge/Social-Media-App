import React, { useState } from "react"
// import axios from "axios"
import { Save } from "@material-ui/icons"
import { useHistory } from "react-router-dom"
// 	https://api.cloudinary.com/v1_1/asghadge
// social-media
// mui
// snack bar code
import ReactLoading from "react-loading"
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
const SignUp = () => {
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    // history
    let history = useHistory();
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
        // length checking
        if (allCurrentData.fname.length < 3 || allCurrentData.lname.length < 3) {
            setSnackbarObj({ text: "First and Last Name min have 3 letters", backgroundColor: "red" });
            setOpen(true);
            return;
        }
        else if (allCurrentData.username.length < 6 || allCurrentData.password.length < 6) {
            setSnackbarObj({ text: "Username and password have min 6 letters", backgroundColor: "red" });
            setOpen(true);
            return;
        }
        const urlUploadCloud = "https://api.cloudinary.com/v1_1/asghadge/image/upload";
        const urlServerUploadUser = "/api/user/add";
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
                        history.push("/match-otp");
                    })
                    .catch((err) => {
                        console.log(err)
                        setSnackbarObj({ text: "Error Occured", backgroundColor: "red" });
                        setOpen(true);
                    })
            })
            .catch((err) => {
                console.log(err)
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
