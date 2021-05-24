const { Router } = require("express");
const jwt = require('jsonwebtoken');


const router = Router();
const User = require("../models/userSchema");
require("../db/conn")

const tokenAge = 10 * 60 * 60 * 24 * 100; //1 day


// import userOtp madule for checking is email and otp match or not
// const User_OTP = require("../models/otpSchema");
const User_OTP = require("../models/otpSchema");
// importing mail sending features
const sendmail = require("../middleware/SendMail");



// handele error
// require("../src/middleware/handleErrors")
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




// token creation
const createToken = (id) => {
    return jwt.sign({ id }, 'thisisaloginandsignuppage', {
        expiresIn: tokenAge * 10  //10 days
    });
}

// we can create these controller fun separetly also in separeate file
router.get('/signup', (req, res) => {
    res.send('signup page')
})
router.get('/login', (req, res) => {
    res.send('login page')
})
router.get('/mail/verification', (req, res) => {
    res.send('you are redirected of mail verification Page from signup page')
})

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const ref = email;
        User.findOne({ email })
            .then(async (email) => {
                if (email === null) {
                    sendmail(ref);
                    res.status(200).json("OTP sent sucssesfully Please verify Email...");
                }
                else res.status(404).json("Email is allready registrered");
            }).catch((err) => {
                res.status(404).json({})
            })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});


// this route used to verify email and otp  
router.post("/mail/verification", (req, res) => {
    const email = req.body.email;
    // const password = req.body.email;
    const otp = req.body.otp;
    User_OTP.findOne({ email: email, otp: otp })
        .then(async (data) => {
            if (data === null) {
                console.log("otp missmatch");
                res.status(404).json({
                    m: "otp miss-match", data
                })
            }
            else {
                // res.status(200).json("otp match");
                // creating user in Database after verification of mail
                console.log("otp matches");
                const password = "pass@1234"
                const user = await User.create({ email, password });
                const token = createToken(user._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: tokenAge * 10 })
                res.status(201).json("Mail Verified Successfully... User added into database...");
                console.log("mail verified Successfully...");
                console.log("User added into database...");
                // console.log(data);
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

router.post("/mail/resend", async (req, res) => {
    const email = req.body.email;
    SendMail(email);
    res.status(200).json({});
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: tokenAge * 10 })
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
})

module.exports = router;