import React, { useState } from "react"
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ReactLoading from "react-loading"

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
        // console.log(id, value);
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    function sendOtp(event) {
        // console.log("sending otp");
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
            <h1 className="heading-auth mt-3 text-center">Please check your email for otp</h1>
            {
                loading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <>
                        <div className="d-flex justify-content-center">
                            <div className="p-4">
                                <span className="text-auth">Email :</span>
                                <input type="email" className="input-field-auth" id="emailMatchOTP" name="email" placeholder="" value={allCurrentData.email} onChange={inputChange} required></input>
                                <br></br>
                                <span className="text-auth" >OTP :</span>
                                <input type="number" name="otp" className="input-field-auth" id="otpMatchOTP" placeholder="" value={allCurrentData.otp} onChange={inputChange} required></input>
                                <div className="text-center mt-3">
                                    <button className="btn btn-outline-success" type="submit" onClick={sendOtp}>Match OTP</button>
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
