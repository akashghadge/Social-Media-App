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
// edit apis
router.post("/edit/dp", (req, res) => {
    const { url, username } = req.body;
})





module.exports = router;