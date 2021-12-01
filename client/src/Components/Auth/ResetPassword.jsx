import axios from "axios";
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ReactLoading from "react-loading"
import Pagebreadcrumb from "../SmallComponents/PageBreadcrumb";
import http from "../../helper/http";

const ResetPassword = () => {
    const { token } = useParams();
    // data
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [loading, setLoading] = useState(false);
    let [open, setOpen] = useState(false);
    let [password, setPassword] = useState("");

    // methods
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    function inputChange(e) {
        setPassword(e.target.value);
    }
    function isError() {
        if (password.length <= 5) {
            setSnackbarObj({ text: "Password should contain atleast 6 letters", backgroundColor: "red" })
            setOpen(true);
            return true;
        }
        return false;
    }
    function changePassword(e) {
        if (isError())
            return;
        setLoading(true);
        const sendData = {
            token: token,
            newPassword: password
        };
        http.changePasswordAPI(sendData)
            .then((data) => {
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
            <Pagebreadcrumb heading="Reset Password" base="Home" url=""></Pagebreadcrumb>
            {
                loading ?
                    <>
                        <div className="cotainer-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </> :
                    <>
                        <div className="container-fluid px-5">
                            <div className="card">
                                <div className="card-body">
                                    <h1 className="heading-auth mt-2 mb-4">Set New Password</h1>
                                    <div className="p-4">
                                        <div className="form-floating mb-3">
                                            <input type="password" id="reset-password" placeholder="temp" className="form-control" value={password} onChange={inputChange}></input>
                                            <label htmlFor="reset-password">Enter New Password</label>
                                        </div>
                                        <div className="text-center mt-3">
                                            <button className="btn btn-outline-success" onClick={changePassword}>Set Password</button>
                                        </div>
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
export default ResetPassword;
