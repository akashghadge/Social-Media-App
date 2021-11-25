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
    const { email, otp } = req.body;
    User_OTP.findOne({ email, otp })
        .then((data) => {
            if (data === null)
                return res.status(404).json({ flag: false, m: "otp miss-match", data })

            // move temp user to main user
            TempUser.findOne({ email })
                .then(async (data) => {
                    let newUser = new User({
                        fname: data.fname,
                        lname: data.lname,
                        email: data.email,
                        username: data.username,
                        password: data.password,
                        PicUrl: data.PicUrl,
                        createdAt: Date.now()
                    });
                    newUser.save()
                        .then(async () => {
                            // delete tempuser and otp because we saved main user succefully
                            await TempUser.findOneAndDelete({ email: email });
                            await User_OTP.findOneAndDelete({ email: email });
                            res.status(200).json({ flag: true, m: "otp match", data });
                        })
                        .catch((err) => {
                            res.status(500).json(err)
                            console.log(err);
                        })
                })
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})

// sending random token url for user to update password
router.post("/mail/forget-password", async (req, res) => {
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err)
            return res.status(500).json(err)

        const token = buffer.toString("hex");
        User.findOne({ email: email })
            .then((data) => {
                if (!data)
                    return res.status(404).json({ error: "user does not exists" });
                data.resetToken = token;
                data.expireToken = Date.now() + 3600000;
                data.save()
                    .then(() => {
                        const dataForEmail = {
                            subject: "Password Reset Request",
                            text: `<p>Click below link to reset your password</p>
                            <a href="http://social-media-app-akash.herokuapp.com/reset-password/${token}">Reset Password</a>`
                        }

                        SendMailGen(email, dataForEmail)
                            .then((data) => {
                                res.status(200).json({
                                    m: "mail sent",
                                    data: data
                                });
                            })
                            .catch((err) => {
                                res.status(500).json("server error");
                            })
                    })
                    .catch((err) => {
                        res.status(500).json("server error");
                    })
            })
    })
})

router.post("/mail/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
        .then((data) => {
            if (!data)
                return res.status(400).json("token may be expired ");
            data.password = newPassword;
            data.resetToken = undefined;
            data.expireToken = undefined;
            data.save()
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch((err) => {
                    res.status(500).json(err);
                })
        })
})

router.get("/mail/test", async (req, res) => {
    SendMail("asghadge6@gmail.com")
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
})
module.exports = router;