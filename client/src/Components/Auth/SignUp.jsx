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
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    profileButtonFollow: {
        color: "#0000ff",
        backgroundColor: "white",
        border: "solid 1px #0000ff",
        margin: "2rem",
        '&:hover': {
            color: "white",
            backgroundColor: "#2222ff",
        },
    }

}));
const SignUp = () => {
    const classes = useStyles();
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
                console.log(data);
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
                        // console.log("match otp");
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

            <div className="">
                <h1 className="signINUPHead">Sign Up</h1>
                {/* <span>Profile Photo :</span> */}
                <span className="createPostTexts">Upload Image</span>
                <label htmlFor="ProfilePic" class="signINUPInputFileField">
                    Upload
                </label>
                <input type="file" id="ProfilePic" className="signINUPInputFileField" onChange={fileInputChange} accept="image/*">
                </input>
                <br></br>
                <br></br>
                <span className="signINUPText" >First name</span>
                <input type="text" className="signINUPInputFields" id="fname" placeholder="" value={allCurrentData.fname} onChange={inputChange} required style={{ boxShadow: "none" }}></input>
                <br></br>
                <span className="signINUPText" >Last name</span>
                <input type="text" className="signINUPInputFields" id="lname" placeholder="" value={allCurrentData.lname} onChange={inputChange} style={{ boxShadow: "none" }} required></input>
                <br></br>
                <span className="signINUPText" style={{ marginRight: "1.4rem" }}>Email</span>
                <input type="email" className="signINUPInputFields" id="email" placeholder="you@example.com" style={{ boxShadow: "none" }} onChange={inputChange} value={allCurrentData.email} required></input>
                <br></br>
                <span className="signINUPText">Username</span>
                <input type="text" className="signINUPInputFields" id="username" placeholder="akash@3" style={{ boxShadow: "none" }} onChange={inputChange} value={allCurrentData.username} required></input>
                <br></br>
                <span className="signINUPText">Password</span>
                <input type="password" className="signINUPInputFields" id="password" onChange={inputChange} style={{ boxShadow: "none" }} value={allCurrentData.password} required></input>
                <br></br>
                {
                    (isLoading) ?
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div> :
                        <Button className={classes.profileButtonFollow} onClick={SendUser}><Save></Save></Button>
                }
            </div>
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default SignUp;
