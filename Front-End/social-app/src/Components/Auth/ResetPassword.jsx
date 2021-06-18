import axios from "axios";
import React, { useState } from "react"
import { useParams } from "react-router-dom"

const ResetPassword = () => {
    let { token } = useParams();
    let [password, setPassword] = useState("");
    function inputChange(e) {
        setPassword(e.target.value);
    }
    function changePassword(e) {
        const urlForReset = "http://localhost:5000/api/mail/reset-password/";
        const sendData = {
            token: token,
            newPassword: password
        };
        axios.post(urlForReset, sendData)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <>
            <h1>Enter New Password</h1>
            <input type="password" value={password} onChange={inputChange}></input>
            <button onClick={changePassword}>Chnage Password</button>
        </>
    )
}
export default ResetPassword;
