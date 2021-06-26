const { Router } = require("express");
const Conversation = require("../models/Conversation.model");
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

router.post("/prev-messages", async (req, res) => {
    const { SenderId, RecId } = req.body;
    const filter = {
        SenderId: SenderId,
        RecId: RecId
    };
    try {
        let data = await Conversation.findOne(filter).populate("SenderId", "username").populate("RecId", "username").populate({
            path: "chats",
            populate: {
                path: "sender",
                select: "username"
            }
        }).exec();
        // console.log(data);
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;
