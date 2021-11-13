import React, { useState } from "react"
import axios from 'axios';
// mui
// loading effect 
import ReactLoading from "react-loading"
const ForgetPassword = (props) => {
    let [loading, setLoading] = useState(false);
    let [email, setEmail] = useState("");
    function changeEmail(e) {
        setEmail(e.target.value);
    }
    function sendResetLink(e) {
        setLoading(true);
        const urlSendResetLink = "/api/mail/forget-password";
        axios
            .post(urlSendResetLink, {
                email: email
            })
            .then((data) => {
                props.openSnackBarForgetPassword(1);
                // loading effect
                setLoading(false);
            })
            .catch((err) => {
                props.openSnackBarForgetPassword(0);
                // loading effect
                setLoading(false);
            })
    }
    return (
        <>
            {
                loading ?
                    <>
                        <div className="container-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <>
                        <div className="d-flex justify-content-center">
                            <div className="py-4">
                                <div className="form-floating">
                                    <input id="forget-password" type="email" className="form-control" placeholder="john@gmail.com" value={email} onChange={changeEmail}></input>
                                    <label htmlFor="forget-password">Please Enter Email </label>
                                </div>
                                <div className="text-center mt-3">
                                    <button className="btn btn-outline-success" onClick={sendResetLink}>Send Link</button>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    )
}
export default ForgetPassword;
