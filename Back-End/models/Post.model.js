const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    photo: { type: String, required: [true, 'photo is req'] },
    desc: { type: String, required: [true, 'text is req'] },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User', unique: true }],
    comments:
        [{
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
        }],
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;