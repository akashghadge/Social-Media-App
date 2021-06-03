const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')
// this temp user stores users temporaly whenn we send email to them and  waiting to verify
const TempUserSchema = new Schema
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
            required: [true, 'please enter first name']
        },
        lname: {
            type: String,
            required: [true, 'please enter first name']
        },
        username:
        {
            type: String,
            requireed: [true, 'please enter username']
        },
        createdAt: { type: Date, expires: 600, default: Date.now() }//here using this data inserted at data base only remain for 10 min
    })


const TempUser = mongoose.model("TempUser", TempUserSchema);
module.exports = TempUser;
