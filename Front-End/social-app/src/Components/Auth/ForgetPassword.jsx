import React, { useState } from "react"
import axios from 'axios';
const ForgetPassword = () => {
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
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <>
            <h1>Enter Your Email</h1>
            <input type="email" value={email} onChange={changeEmail}></input>
            <button onClick={sendResetLink}>Reset Password</button>
        </>
    )
}
export default ForgetPassword;
