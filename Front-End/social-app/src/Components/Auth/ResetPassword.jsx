import axios from "axios";
import React, { useState } from "react"
import { useParams } from "react-router-dom"
// mui
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
const ResetPassword = () => {
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    let { token } = useParams();
    let [password, setPassword] = useState("");
    function inputChange(e) {
        setPassword(e.target.value);
    }
    function changePassword(e) {
        if (password.length <= 5) {
            setSnackbarObj({ text: "Password should contain atleast 6 letters", backgroundColor: "red" })
            return setOpen(true);
        }
        const urlForReset = "http://localhost:5000/api/mail/reset-password/";
        const sendData = {
            token: token,
            newPassword: password
        };
        axios.post(urlForReset, sendData)
            .then((data) => {
                // console.log(data);
                setSnackbarObj({ text: "Email is Sent", backgroundColor: "green" });
                setOpen(true);
            })
            .catch((err) => {
                setSnackbarObj({ text: "Email is not Sent error occured", backgroundColor: "red" });
                setOpen(true);
            });
    }
    return (
        <>
            <h1>Enter New Password</h1>
            <input type="password" value={password} onChange={inputChange}></input>
            <button onClick={changePassword}>Chnage Password</button>

            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default ResetPassword;
