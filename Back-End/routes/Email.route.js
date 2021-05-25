const { Router } = require("express");
const router = Router();

// import userOtp madule for checking is email and otp match or not
const User_OTP = require("../models/User_OTP");
// importing mail sending features
const SendMail = require("../middleware/SendMail");

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
                console.log("otp match");
                console.log(data);
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

router.post("/mail/resend", async (req, res) => {
    const email = req.body.email;
    SendMail(email).then(() => {
        res.status(200).json("mail send");
    }).catchl(() => {
        res.status(404).json("error occured");
    })
})

module.exports = router;