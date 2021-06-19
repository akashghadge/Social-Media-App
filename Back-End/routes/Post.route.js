'use strict'
const { Router } = require("express");
const router = Router();

// database modules
const User = require("../models/User.model");
const Post = require("../models/Post.model");
// for error handleing
const { handleErrors, handleErrorsPost } = require("../helpers/handleErrors");
const verify = require("../middleware/verify");
// crud operation on post
router.post("/new", async (req, res) => {
    const { photo, desc, postedById } = req.body;
    let newPost = new Post({
        photo: photo, desc: desc, postedBy: postedById
    });
    newPost.save().
        then((data) => {
            console.log("Post succefully posted by", postedById);
            res.status(200).json(data);
        }).catch((err) => {
            // console.log(err);
            let errors = handleErrorsPost(err);
            console.log(errors);
            res.status(400).json(errors);
        })
})

router.post("/update", async (req, res) => {
    const { id, photo, desc } = req.body;
    const filter = { _id: id };
    const change = { photo: photo, desc: desc };
    try {
        let data = await Post.findOneAndUpdate(filter, change);
        console.log("updated post \n", data);
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    Post.findOneAndDelete({ _id: id })
        .then((data) => {
            console.log("Post Deleted " + data);
            res.status(200).json("post deleted succefully");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json("post could not deleted");
        })
})

// get all posts
router.post("/all", async (req, res) => {
    let data = await Post.find({}).populate("postedBy", "username _id").exec();
    res.json(data);
})


// likes operations on post
// get all likers
router.post("/like", async (req, res) => {
    const { idOfPost } = req.body;
    let data = await Post.findById(idOfPost);
    console.log(idOfPost + " have " + data.likes + " likers");
    res.status(200).json(data.likes);
})
// add like
router.post("/like/add", verify, async (req, res) => {
    const { idOfPost } = req.body;
    const idOfLiker = res.locals.id;
    let data = await Post.updateOne({ _id: idOfPost }, {
        $push:
            { likes: idOfLiker }
    });
    console.log(data);
    res.status(200).json(data);
});

// remove like
router.post("/like/remove", verify, async (req, res) => {
    const { idOfPost } = req.body;
    const idOfLiker = res.locals.id;
    let data = await Post.updateOne({ _id: idOfPost }, {
        $pull:
        {
            likes: idOfLiker
        }
    });
    console.log(data);
    res.status(200).json(data);
});

router.post("/like/count", async (req, res) => {
    const { idOfPost } = req.body;
    let data = await Post.findOne({ _id: idOfPost });
    console.log(idOfPost + " have " + data.likes.length);
    res.json(data.likes.length);
})

// comments operations
// get all comments
router.post("/comment", async (req, res) => {
    const { idOfPost } = req.body;
    let data = await Post.findById(idOfPost).populate(
        {
            path: "comments",
            populate: {
                path: "postedBy",
                select: "username"
            }
        }
    ).exec();
    console.log(idOfPost + " have " + data + " comments");
    res.status(200).json(data);
});
// add like
router.post("/comment/add", async (req, res) => {
    const { idOfPost, idOfCommentor, text } = req.body;
    let comment = {
        text: text,
        postedBy: idOfCommentor
    };
    let data = await Post.updateOne({ _id: idOfPost }, {
        $push:
            { comments: comment }
    });
    console.log(data);
    res.status(200).json(data);
});
// remove comment
router.post("/comment/remove", async (req, res) => {
    const { idOfPost, idOfComment } = req.body;
    let data = await Post.updateOne({ _id: idOfPost }, {
        $pull:
        {
            comments: { _id: idOfComment }
        }
    });
    console.log(data);
    res.status(200).json(data);
});


module.exports = router;