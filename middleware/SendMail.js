// TODO: add findAndModify in connection set
"use strict";

// this module is used to transfer the otp mail
require("dotenv").config();
const mailer = require("nodemailer");
const mongoose = require("mongoose");

// getting schema for user
const User_OTP = require("../models/User_OTP");

const SendMail = (toMail) => {
    return new Promise
        (function (resolve, reject) {
            // genarating random otp of 4 digits
            let otp = Math.random();
            otp *= 10000;
            otp = Math.floor(otp);

            const transport = mailer.createTransport(
                {
                    service: "hotmail",
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
                    reject();
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
                    resolve();
                }
            })

        })
}

const SendMailGen = (toMail, dataTosend) => {
    return new Promise
        (function (resolve, reject) {
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
                subject: dataTosend.subject,
                html: dataTosend.text
            }
            transport.sendMail(body, async function (err, data) {
                if (err) {
                    console.log("error occured");
                    console.log(err);
                    reject();
                }
                else {
                    console.log(data);
                    resolve();
                }
            })
        })
}

module.exports = { SendMail, SendMailGen };