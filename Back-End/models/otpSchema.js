const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// here i am creating new schema where i store users email and otp associat to it
const otpSchema = new Schema
    ({
        email: {
            type: String
        },
        otp:
        {
            type: Number
        },
        createdAt: { type: Date, expires: 600, default: Date.now }//here using this data inserted at data base only remain for 10 min
    })


const User_OTP = mongoose.model("User_OTP", otpSchema);
module.exports = User_OTP;