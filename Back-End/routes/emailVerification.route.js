const { Router } = require("express");
const router = Router();

// import userOtp madule for checking is email and otp match or not
const User_OTP = require("../models/User_OTP");


// this route used to verify email and otp  
router.post("/mail/verification", (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    User_OTP.findOne({ email: email, otp: otp })
        .then((data) => {
            if (data === null) {
                console.log("otp missmatch");
                res.status(404).json({
                    m: "otp miss-match", data
                })
            }
            else {
                res.status(200).json("otp match");
                console.log(data);
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

module.exports = router;