import React, { useState } from "react"
const MatchOTP = () => {
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
                console.log(data);
                alert(data.m)
            })
            .catch((err) => {
                console.log(err);
                alert(err.m)
            })
    }
    return (
        <>
            <label >Email</label>
            <input type="email" className="" id="emailMatchOTP" name="email" placeholder="" value={allCurrentData.email} onChange={inputChange} required></input>
            <label >OTP</label>
            <input type="number" name="otp" className="" id="otpMatchOTP" placeholder="" value={allCurrentData.otp} onChange={inputChange} required></input>
            <button type="submit" onClick={sendOtp}>Submit</button>
        </>
    )
}
export default MatchOTP;
