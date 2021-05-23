// TODO: add findAndModify in connection set
"use strict";
// this module is used to transfer the otp mail
require("dotenv").config();
const mailer = require("nodemailer");
const mongoose = require("mongoose");
// getting schema for user
const User_OTP = require("../models/User_OTP");

const SendMail = (toMail) => {
    // genarating random otp of 4 digits
    let otp = Math.random();
    otp *= 10000;
    otp = Math.floor(otp);

    const transport = mailer.createTransport(
        {
            service: "gmail",
            auth: {
                user: process.env.E_USER,
                pass: process.env.E_PASS
            }
        }
    )
    // sending otp to user with this body
    const body = {
        from: process.env.E_USER,
        to: toMail,
        subject: "Here is Your OTP for sign-up",
        text: `This is your otp for next 10 min\n${otp}`
    }

    transport.sendMail(body, async function (err, data) {
        if (err) {
            console.log("error occured");
            console.log(err);
        }
        else {
            console.log(data);
            // check is we already send email or not if we send it then just update it
            const fileter = { email: toMail };
            const update = { otp: otp, createdAt: Date.now() };
            let doc = await User_OTP.findOneAndUpdate(fileter, update, {
                new: true, //By default, findOneAndUpdate() returns the document as it was before update was applied.
                upsert: true//normal findOneAndUpdate() if it finds a document that matches filter. But, if no document matches filter, MongoDB will insert one by combining filter and update
            });
            console.log(doc);
            /** 
             making new user to adding user_otp database after that we access it verify otp and email using route
             let newUserOTP = new User_OTP({
                     email: toMail, otp: otp
                 });
                 newUserOTP.save().then((data) => {
                         console.log("OTP is saved correctly", data);
                     }).catch((err) => {
                             console.log("otp not saved correctly", err);
                         })
            */
        }
    })
}

module.exports = SendMail;