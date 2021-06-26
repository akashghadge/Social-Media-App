import axios from "axios";
import React, { useState } from "react"
import { useParams } from "react-router-dom"
// mui
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from "react-loading"
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
const ResetPassword = () => {
    const classes = useStyles();
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [loading, setLoading] = useState(false);
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
        setLoading(true);
        const urlForReset = "/api/mail/reset-password/";
        const sendData = {
            token: token,
            newPassword: password
        };
        axios.post(urlForReset, sendData)
            .then((data) => {
                // console.log(data);
                setSnackbarObj({ text: "Email is Sent", backgroundColor: "green" });
                setOpen(true);
                setLoading(false);
            })
            .catch((err) => {
                setSnackbarObj({ text: "Email is not Sent error occured", backgroundColor: "red" });
                setOpen(true);
                setLoading(false);
            });
    }
    return (
        <>
            <h1 style={{ margin: "1rem" }} className="settingMainHeading">Enter New Password</h1>
            {
                loading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </> :
                    <>
                        <div className="settingContainer">
                            <div className="settingContainerChild">
                                <span className="settingText">Enter New Password</span>
                                <input type="password" className="forgetPasswordInputField" value={password} onChange={inputChange}></input>
                                <br></br>
                                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                                    <Button className={classes.forgetPasswordButton} onClick={changePassword}>Chnage Password</Button>
                                </div>
                            </div>
                        </div>
                        {/* snackbar */}
                        <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                            text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
                    </>
            }
        </>
    )
}
export default ResetPassword;
