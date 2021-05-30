const { Router } = require("express");
const router = Router();

router.post("/", (req, res,) => {
    res.status(200).json(res.locals.currentuser)
});
module.exports = router;