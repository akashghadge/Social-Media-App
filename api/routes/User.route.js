const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models and middlewares  
const User = require("../models/User.model");
const TempUser = require("../models/TempUser.model");
const { SendMail } = require("../middleware/SendMail");

const { handleErrors } = require("../helpers/handleErrors");
const blankImage = "http://social-media-app-akash.herokuapp.com/public/images/blank.png";

async function isUserExists(email) {
    try {
        let user = await User.find({ email: email });
        if (user.length !== 0)
            return true;
        return false;
    }
    catch (err) {
        throw new Error(err)
    }
}

async function isTempUserExists(email) {
    try {
        let user = await TempUser.find({ email: email });
        if (user.length !== 0)
            return true;
        return false;
    }
    catch (err) {
        throw new Error(err)
    }
}

// router.post("/add", async (req, res) => {
//     const { fname, lname, email, username, password } = req.body;
//     let PicUrl = req.body.PicUrl;

//     try {
//         if (await isUserExists(email)) {
//             return res.status(409).json("user already exits !!");
//         }
//         if (await isTempUserExists(email)) {
//             return res.status(409).json("temp user already exists !!");
//         }

//         SendMail(email)
//             .then(() => {
//                 if (PicUrl == "") {
//                     PicUrl = "http://social-media-app-akash.herokuapp.com/public/images/blank.png";
//                 }
//                 let newTempUser = new TempUser({
//                     fname: fname,
//                     lname: lname,
//                     email: email,
//                     username: username,
//                     password: password,
//                     PicUrl: PicUrl,
//                     createdAt: Date.now()
//                 });
//                 newTempUser.save()
//                     .catch((err) => {
//                         res.status(500).json("temp user is not created");
//                     })
//                 res.status(200).json("otp send succefully");
//             })
//             .catch((err) => {
//                 res.status(500).json("OTP not send");
//             })
//     } catch (err) {
//         let error = handleErrors(err);;
//         res.status(404).json(error);
//     }

// })


router.post("/create", async (req, res) => {
    const { fname, lname, email, username, password } = req.body;
    const PicUrl = req.body.PicUrl == "" ? blankImage : req.body.PicUrl;
    try {
        if (await isUserExists(email)) {
            return res.status(409).json("user already exits !!");
        }
        let newUser = new User({
            fname: fname,
            lname: lname,
            email: email,
            username: username,
            password: password,
            PicUrl: PicUrl,
            createdAt: Date.now()
        });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (err) {
        let error = handleErrors(err);
        res.status(404).json(error);
    }
})
router.post("/in", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            let payload = {
                username: username,
                id: user._id
            }

            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
            res.status(200).json({ "jwt": accessToken })
        }
        else {
            res.status(400).json("invalid password");
        }
    } else {
        res.status(401).json("invalid username");
    }
})

// public profile user
router.post("/public-profile", async (req, res) => {
    const { id } = req.body;
    try {
        let publicUser = await User.findById(id).select("-password -expireToken -resetToken -email -followers -following");
        if (!publicUser) {
            return res.status(404).json("user not found");
        }
        res.status(200).json(publicUser);
    }
    catch (err) {
        res.status(500).json("internal server error")
    }
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
