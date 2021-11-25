const { Router } = require("express");
const router = Router();
const verify = require("../middleware/verify");
//models and middlewares  
const Notification = require("../models/Notification.model");

router.post("/all", verify, async (req, res) => {
    try {
        let data = await Notification.find({ userId: res.locals.id });
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }

})
router.post("/delete", async (req, res) => {
    const { idOfNote } = req.body;
    try {
        let data = await Notification.findByIdAndDelete(idOfNote);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
