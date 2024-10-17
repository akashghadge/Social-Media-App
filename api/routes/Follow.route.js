'use strict'
const { Router } = require("express");
const router = Router();

// database modules
const User = require("../models/User.model");
const verify = require("../middleware/verify");
const addNote = require("../helpers/addNotification");
//get followers of user
router.post("/followers/all", async (req, res) => {
    const { userId } = req.body;
    try {
        let data = await User.findById(userId).populate("followers", "username _id PicUrl fname lname").select("followers -_id");
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json(error)
    }
});
// get following of user
router.post("/following/all", async (req, res) => {
    const { userId } = req.body;
    try {
        let data = await User.findById(userId).populate("following", "username _id PicUrl fname lname").select("following -_id");;
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json(error)
    }
})
// add follow
// for this firslty we need to add the following in user who send request and follower in user who recived
const addFollow = async (userSend, userRecive) => {
    // adding following in user send
    return new Promise
        (async function (resolve, reject) {
            try {
                await User.updateOne({ _id: userSend },
                    {
                        $push: {
                            following: userRecive
                        }
                    });
                // adding the new follower in user recive
                await User.updateOne({ _id: userRecive },
                    {
                        $push: {
                            followers: userSend
                        }
                    })
                // adding the notification to the user who recieved on follwer
                await addNote({
                    ID: userRecive,
                    note: `1 person started following you check followers`
                })
                resolve();
            }
            catch (err) {
                reject(err);
            }
        })
}

const removeFollow = async (userSend, userReceive) => {
    // remove following in user send
    return new Promise
        (async function (resolve, reject) {
            try {
                await User.updateOne({ _id: userSend },
                    {
                        $pull: {
                            following: userReceive
                        }
                    });
                // removeing the  follower in user recive
                await User.updateOne({ _id: userReceive },
                    {
                        $pull: {
                            followers: userSend
                        }
                    })

                // notify user who lost one follower
                await addNote({
                    ID: userReceive,
                    note: `1 person unfollow you check followers`
                })
                resolve();
            }
            catch (err) {
                reject(err);
            }
        })
}
router.post("/following/add", verify, async (req, res) => {
    addFollow(res.locals.id, req.body.userReceive)
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json(err))
});

router.post("/following/remove", verify, async (req, res) => {
    removeFollow(res.locals.id, req.body.userReceive)
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json(err))
});





module.exports = router;