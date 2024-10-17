const { Router } = require("express");
const router = Router();
const User = require("../models/User.model");
const addNote = require("../helpers/addNotification");
// getting current user
router.post("/me", (req, res) => {
    res.status(200).json({
        username: res.locals.username,
        id: res.locals.id
    });
});
router.post("/profile", async (req, res) => {
    const user = await User.findById({ _id: res.locals.id }).select("-password");
    if (user)
        res.status(200).json(user);
    else
        res.status(400).json({ err: "invalid user in profile section someone is tempting api" });
})

// for editing profile
router.post("/profile-edit", async (req, res) => {
    const user = await User.findById({ _id: res.locals.id }).select("_id username fname lname about");
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(400).json({ err: "invalid user in profile section someone is tempting api" });
    }
})
// edit apis
router.post("/edit", (req, res) => {
    const { update, id } = req.body;
    User.findByIdAndUpdate(id, update)
        .then(async (data) => {
            // adding notification
            await addNote({
                ID: res.locals.id,
                note: `Profile Updated..`
            })
            res.status(200).json("update succefully");
        })
        .catch((err) => {
            res.status(500).json("update unsuccefully!!!!!");
        })
})

router.post("/edit-dp", (req, res) => {
    const { id, update } = req.body;
    User.findByIdAndUpdate(id, update)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json(data);
        })
})



module.exports = router;