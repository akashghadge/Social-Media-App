import React, { useState } from "react"
import axios from 'axios';
// mui
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
const ForgetPassword = () => {
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
        console.log(email);
    }
    function sendResetLink(e) {
        const urlSendResetLink = "http://localhost:5000/api/mail/forget-password";
        axios
            .post(urlSendResetLink, {
                email: email
            })
            .then((data) => {
                console.log(data);
                setSnackbarObj({ text: "mail send succeefully", backgroundColor: "green" });
                setOpen(true);
            })
            .catch((err) => {
                console.log(err);
                setSnackbarObj({ text: "mail send failed", backgroundColor: "red" });
                setOpen(true);
            })
    }
    return (
        <>
            <h1>Enter Your Email</h1>
            <input type="email" value={email} onChange={changeEmail}></input>
            <button onClick={sendResetLink}>Reset Password</button>

            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default ForgetPassword;
