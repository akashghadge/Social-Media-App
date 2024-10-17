const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')
// here i am creating new schema where i store users email and otp associat to it
const UserSchema = new Schema
    ({
        email: {
            type: String,
            required: [true, 'please enter an email'],
            unique: true,
            lowercase: true,
            validate: [isEmail, 'please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'please enter an password'],
            minLength: [6, 'minimum password length is 6 charecters'],
            default: 'pass@123'
        },
        fname: {
            type: String,
            minLength: [3, 'minimum password length is 3 charecters'],
            required: [true, 'please enter first name']
        },
        lname: {
            type: String,
            minLength: [3, 'minimum password length is 3 charecters'],
            required: [true, 'please enter first name']
        },
        username:
        {
            type: String,
            minLength: [6, 'minimum password length is 6 charecters'],
            required: [true, 'please enter username']
        },
        PicUrl: {
            type: String,
            default: "http://social-media-app-8szj.onrender.com/public/images/blank.png"
        },
        resetToken: {
            type: String
        },
        expireToken: {
            type: Date
        },
        about: {
            type: String
        },
        following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        chatId: {
            type: String
        },
        createdAt: { type: Date, default: Date.now }
    })
// hashing password
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model("User", UserSchema);
module.exports = User;
