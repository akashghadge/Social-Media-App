import React, { useState } from "react"
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"

const MatchOTP = () => {
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
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
        console.log("sending otp");
        const urlOtpMatch = "http://localhost:5000/api/mail/verification";
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
            })
            .catch((err) => {
                setSnackbarObj({ text: "OTP mismatch", backgroundColor: "red" });
                setOpen(true);
            })
    }
    return (
        <>
            <label >Email</label>
            <input type="email" className="" id="emailMatchOTP" name="email" placeholder="" value={allCurrentData.email} onChange={inputChange} required></input>
            <label >OTP</label>
            <input type="number" name="otp" className="" id="otpMatchOTP" placeholder="" value={allCurrentData.otp} onChange={inputChange} required></input>
            <button type="submit" onClick={sendOtp}>Submit</button>
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default MatchOTP;
