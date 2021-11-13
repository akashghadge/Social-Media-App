import React, { useState } from "react"
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import Pagebreadcrumb from "../SmallComponents/PageBreadcrumb"
// loading and navigation
import ReactLoading from "react-loading"
import { NavLink } from "react-router-dom"
const MatchOTP = () => {
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [loading, setLoading] = useState(false);
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    let [allCurrentData, setAllCurrentData] = useState({
        email: "",
        otp: 0,
    });
    function inputChange(event) {
        const { name, value } = event.target
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    function sendOtp(event) {
        setLoading(true);
        const urlOtpMatch = "/api/mail/verification";
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(allCurrentData)
        };
        fetch(urlOtpMatch, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                let c = "red";
                if (data.flag) {
                    c = "green"
                }
                setSnackbarObj({ text: data.m, backgroundColor: c });
                setOpen(true);
                setLoading(false);
            })
            .catch((err) => {
                setSnackbarObj({ text: "OTP mismatch", backgroundColor: "red" });
                setLoading(false);
                setOpen(true);
            })
    }
    return (
        <>
            <Pagebreadcrumb heading="Mail Verification" base="Home" url="" />
            {
                loading ?
                    <>
                        <div className="cotainer-center-all">
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <>
                        <div className="container-fluid px-5">
                            <div className="card">
                                <div className="card-body">
                                    <h1 className="heading-auth mt-2 mb-4">Mail Verification</h1>
                                    <div className="row">
                                        <div className="form-floating mb-3 col-12 col-md-6 px-1">
                                            <input type="email" className="form-control" id="emailMatchOTP" name="email" placeholder="" value={allCurrentData.email} onChange={inputChange} placeholder="." required></input>
                                            <label htmlFor="emailMatchOTP">Enter Email</label>
                                        </div>
                                        <div className="form-floating mb-3 col-12 col-md-6 px-1">
                                            <input type="number" name="otp" className="form-control" id="otpMatchOTP" placeholder="123456" value={allCurrentData.otp} onChange={inputChange} required></input>
                                            <label htmlFor="otpMatchOTP" >Enter OTP</label>
                                        </div>
                                    </div>
                                    <div className="text-center mt-3 d-flex justify-content-center">
                                        <button className="btn btn-outline-success d-block w-50 w-md-25" type="submit" onClick={sendOtp}>Match OTP</button>
                                    </div>
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
export default MatchOTP;
