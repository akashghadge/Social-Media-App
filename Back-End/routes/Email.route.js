const { Router } = require("express");
const router = Router();

// import userOtp madule for checking is email and otp match or not
const User_OTP = require("../models/User_OTP");
const TempUser = require("../models/TempUser.model")
const User = require("../models/User.model")
// importing mail sending features
const SendMail = require("../middleware/SendMail");


// this route used to verify email and otp  
router.post("/mail/verification", (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    // find for otp
    User_OTP.findOne({ email: email, otp: otp })
        .then((data) => {
            // if otp not found return otp miss-match
            if (data === null) {
                console.log("otp missmatch");
                res.status(404).json({
                    m: "otp miss-match", data
                })
            }
            else {
                // move temp user to main user
                TempUser.find({ email: email }).then(async (data) => {
                    console.log(data);
                    let newUser = new User({
                        fname: data[0].fname,
                        lname: data[0].lname,
                        email: data[0].email,
                        username: data[0].username,
                        password: data[0].password,
                        PicUrl: data[0].PicUrl,
                        createdAt: Date.now()
                    });
                    newUser.save()
                        .then(async (dataUser) => {
                            // delete tempuser and otp because we saved main user succefully
                            await TempUser.findOneAndDelete({
                                email: email
                            });
                            await User_OTP.findOneAndDelete({
                                email: email
                            });
                            console.log("user added succefully", dataUser);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                console.log(data);
                console.log("otp match");
                res.status(200).json("otp match");
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

//for resending the mail 
router.post("/mail/resend", async (req, res) => {
    const email = req.body.email;
    SendMail(email).then(() => {
        res.status(200).json("mail send");
    }).catchl(() => {
        res.status(404).json("error occured");
    })
})

module.exports = router;