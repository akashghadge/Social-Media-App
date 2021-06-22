const { Router } = require("express");
const router = Router();

//models and middlewares  
const User = require("../models/User.model");

router.post("/user-list", async (req, res) => {
    const { id } = req.body;
    User.find({ _id: { $ne: id } }).select("username _id")
        .then((data) => {
            console.log(data);
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
        })
})


module.exports = router;
