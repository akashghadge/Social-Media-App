import React, { useState } from "react"
import ReactLoading from "react-loading"
import http from "../../helper/http";

const ForgetPassword = (props) => {
    // loading state
    let [loading, setLoading] = useState(false);
    let [email, setEmail] = useState("");
    function changeEmail(e) {
        setEmail(e.target.value);
    }
    function sendResetLink(e) {
        setLoading(true);
        const body = {
            email: email
        };
        http.RequestForgetPassword(body)
            .then((data) => {
                props.openSnackBarForgetPassword(1);
                setLoading(false);
            })
            .catch((err) => {
                props.openSnackBarForgetPassword(0);
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
