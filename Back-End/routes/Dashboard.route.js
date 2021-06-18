const { Router } = require("express");
const router = Router();
const User = require("../models/User.model");
// getting current user
router.post("/me", (req, res) => {
    res.status(200).json({
        username: res.locals.username,
        id: res.locals.id
    });
});
router.post("/profile", async (req, res) => {
    const user = await User.findById({ _id: res.locals.id }).select("-password");
    if (user) {
        res.status(200).json(user);
    }
    else {
        console.log("invalid user in profile section someone is tempting api");
        res.status(400).json({ err: "invalid user in profile section someone is tempting api" });
    }
})
// for editing profile
router.post("/profile-edit", async (req, res) => {
    const user = await User.findById({ _id: res.locals.id }).select("_id username fname lname");
    if (user) {
        res.status(200).json(user);
    }
    else {
        console.log("invalid user in profile section someone is tempting api");
        res.status(400).json({ err: "invalid user in profile section someone is tempting api" });
    }
})
// edit apis
router.post("/edit", (req, res) => {
    const { update, id } = req.body;
    User.findByIdAndUpdate(id, update)
        .then((data) => {
            // console.log(data);
            res.status(200).json("update succefully");
        })
        .catch((err) => {
            // console.log(err);
            res.status(500).json("update unsuccefully!!!!!");
        })
})





module.exports = router;