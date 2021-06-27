// change url in production 
//send mail to user whtn reset password is triggered 


const { Router } = require("express");
const router = Router();
const crypto = require("crypto");
// import userOtp madule for checking is email and otp match or not
const User_OTP = require("../models/User_OTP");
const TempUser = require("../models/TempUser.model")
const User = require("../models/User.model")
// importing mail sending features
const { SendMail, SendMailGen } = require("../middleware/SendMail");

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
                    flag: false, m: "otp miss-match", data
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
                res.status(200).json({
                    flag: true, m: "otp match", data
                });
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

router.post("/mail/forget-password", async (req, res) => {
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex");
        User.findOne({ email: email })
            .then((data) => {
                if (!data) {
                    return res.status(422).json({ error: "user does not exists" });
                }
                data.resetToken = token;
                data.expireToken = Date.now() + 3600000;
                data.save()
                    .then((result) => {
                        const dataForEmail = {
                            subject: "Password Reset Request",
                            text: `<p>Click link to reset your password</p>
                            <a href="http://social-media-app-akash.herokuapp.com/reset-password/${token}">here</a>
                            `  }

                        SendMailGen(email, dataForEmail)
                            .then((data) => {
                                res.status(200).json({
                                    m: "mail sent",
                                    data: data
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json("server error");
                            })
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json("server error");
                    })
            })
    })
})

router.post("/mail/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    console.log(token, newPassword);
    User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
        .then((data) => {
            if (!data) {
                return res.status(400).json("token may be expired ");
            }
            data.password = newPassword;
            data.resetToken = undefined;
            data.expireToken = undefined;
            data.save()
                .then((data) => {
                    console.log(data);
                    res.status(200).json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json(err);
                })
        })
})
module.exports = router;