import React, { useState } from "react"
import axios from 'axios';
// mui
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    forgetPasswordButton: {
        color: "#00ff00",
        backgroundColor: "white",
        border: "solid 1px #00ff00",
        '&:hover': {
            color: "white",
            backgroundColor: "#22ff22",
        },
    }

}));
const ForgetPassword = () => {
    const classes = useStyles();
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    let [email, setEmail] = useState("");
    function changeEmail(e) {
        setEmail(e.target.value);
        // console.log(email);
    }
    function sendResetLink(e) {
        const urlSendResetLink = "http://localhost:5000/api/mail/forget-password";
        axios
            .post(urlSendResetLink, {
                email: email
            })
            .then((data) => {
                // console.log(data);
                setSnackbarObj({ text: "mail send succeefully", backgroundColor: "green" });
                setOpen(true);
            })
            .catch((err) => {
                // console.log(err);
                setSnackbarObj({ text: "mail send failed", backgroundColor: "red" });
                setOpen(true);
            })
    }
    return (
        <>
            <h1 style={{ margin: "1rem" }} className="settingMainHeading">Enter Your Email</h1>
            <div className="settingContainer">
                <div className="settingContainerChild">
                    <span className="settingText">Please Enter Your Email : </span>
                    <input type="email" className="forgetPasswordInputField" value={email} onChange={changeEmail}></input>
                    <br></br>
                    <br></br>
                    <div style={{ textAlign: "center" }}>
                        <Button className={classes.forgetPasswordButton} onClick={sendResetLink}>Reset Password</Button>
                    </div>
                </div>
            </div>

            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default ForgetPassword;
