"use strict";
// inital set up of server
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;


// must needed packages
const cros = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");


// middlewares
app.use(express.json());
app.use(cros());
app.use(cookieParser());


// getting db connection
require("./DB/conn");


// mail verificatin
// const SendMail = require("./middleware/SendMail");
// SendMail("akashsghadge06@gmail.com").then(() => {
//     console.log("succefully send email");
// }).catch(() => {
//     console.log("mail not send ");
// })


// api routers
const EmailRoute = require("./routes/Email.route");
const User = require("./routes/User.route");
app.use("/api/", EmailRoute);
app.use("/api/user", User);

app.listen(port, () => {
    console.log("Server is listening on port :", port);
})