const { Router } = require("express");
const router = Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//models and middlewares  
const User = require("../models/User.model");
const TempUser = require("../models/TempUser.model");
const SendMail = require("../middleware/SendMail");

const { handleErrors } = require("../helpers/handleErrors");

// user addding route
router.post("/add", (req, res) => {
    // geting data from request
    console.log(req.body);
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const PicUrl = req.body.PicUrl;

    // finding for exiting user if not add it
    try {
        User.find({ email: email })
            .then(async (data) => {
                // if user is exists in user database then return 404 error message
                if (data.length != 0) {
                    res.status(404).json("user already exists!!");
                }
                else {
                    TempUser.find({ email: email })
                        .then((dataTemp) => {
                            // check in temp database if user in temp then also return error message
                            if (dataTemp.length != 0) {
                                console.log("temp user already exists !!");
                                res.status(404).json("temp user already exists !!");
                            }
                            else {
                                // if user not in main and temp database then only create temp user and send mail
                                SendMail(email)
                                    .then((sendData) => {
                                        let newTempUser = new TempUser({
                                            fname: fname,
                                            lname: lname,
                                            email: email,
                                            username: username,
                                            password: password,
                                            PicUrl: PicUrl,
                                            createdAt: Date.now()
                                        });
                                        newTempUser.save()
                                            .then((data) => {
                                                console.log("temp user saved succefully");
                                            })
                                            .catch((err) => {
                                                console.log("temp user is not created ", err);
                                            })
                                        res.status(200).json("otp send succefully");
                                    })
                                    .catch((err) => {
                                        res.status(404).json("otp not send");
                                    })
                            }
                        })
                        .catch((err) => {
                            res.status(500).json("server error for finding temp user");
                        })
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json("server error for finding user");
            })
    } catch (err) {
        let error = handleErrors(err);;
        console.log(error);
        res.status(404).json(error);
    }

})


router.post("/in", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // getting user data
    const user = await User.findOne({ username: username });
    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            /**
             *issuesing the token
             */
            let payload = {
                username: username,
                id: user._id
            }

            //create the access token with the shorter lifespan
            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 900 });
            console.log(username, "has sign in");
            res.status(200).json({
                "jwt": accessToken
            })
        }
        else {
            console.log("invalid password");
            res.status(400).json("invalid password");
        }
    } else {
        console.log("invalid username");
        res.status(401).json("invalid username");
    }
})

// public profile user
router.post("/public-profile", async (req, res) => {
    const { id } = req.body;
    try {
        let publicUser = await User.findById(id).select("-password -expireToken -resetToken -email -fname -lname -followers -following");
        if (!publicUser) {
            return res.status(400).json("user not found");
        }
        console.log(publicUser);
        res.status(200).json(publicUser);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("internal server error")
    }
})


// TODO delete this part later
router.post("/all", async (req, res) => {
    let data = await User.find({});
    res.status(200).json(data);
})
router.get("/allUsers", async (req, res) => {
    let data = await User.find({});
    res.status(200).json(data);
})

router.get("/all-users-homepage", async (req, res) => {
    try {
        let data = await User.find({}).select("username _id PicUrl");
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;
