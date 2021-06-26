import React, { useState } from "react"
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from "react-loading"
const useStyles = makeStyles((theme) => ({
    MatchOTPButton: {
        color: "#00ff00",
        backgroundColor: "white",
        border: "solid 1px #00ff00",
        '&:hover': {
            color: "white",
            backgroundColor: "#22ff22",
        },
    }

}));
const MatchOTP = () => {
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
            <h1 style={{ margin: "1rem" }} className="settingMainHeading">Please Enter Your Email and OTP</h1>
            {
                loading ?
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                        </div>
                    </>
                    :
                    <>
                        <div className="settingContainer">
                            <div className="settingContainerChild">
                                <span className="settingText">Email :</span>
                                <input type="email" className="matchOTPInputField" id="emailMatchOTP" name="email" placeholder="" value={allCurrentData.email} onChange={inputChange} required></input>
                                <br></br>
                                <span className="settingText" >OTP :</span>
                                <input style={{ marginLeft: "0.5rem" }} type="number" name="otp" className="matchOTPInputField" id="otpMatchOTP" placeholder="" value={allCurrentData.otp} onChange={inputChange} required></input>
                                <br></br>
                                <div style={{ textAlign: "center", margin: "2rem" }}>
                                    <Button className={classes.MatchOTPButton} type="submit" onClick={sendOtp}>Match OTP</Button>
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
