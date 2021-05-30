const { Router } = require("express");
const jwt = require("jsonwebtoken");
const router = Router();

//models and middlewares  
let User = require("../models/User.model");
const TempUser = require("../models/TempUser.model");
const SendMail = require("../middleware/SendMail");

// error handler class
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
    // incorrect email->login
    if (err.message === 'incorrect Email') {
        errors.email = 'this email is not registerd';
    }
    if (err.message === 'incorrect Password') {
        errors.password = 'this is incorrect password';
    }
    // dublicate email->signup

    if (err.code === 11000) {
        errors.email = 'that email is already registred';
        return errors;
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// user addding route
router.post("/add", (req, res) => {
    // geting data from request
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;


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

module.exports = router;
