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


// mail verificatin
const SendMail = require("./middleware/SendMail");
const EmailRoute = require("./routes/Email.route");
app.use("/api/", EmailRoute);

// SendMail("akashsghadge06@gmail.com");
// SendMail("akashsghadge06@gmail.com");

// database connections
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose.connect("mongodb://localhost/email-verification", {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false
}).then((data) => {
    console.log("DB is connected..");
}).catch((err) => {
    console.log(err);
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Database connected sucessfully");
})






app.listen(port, () => {
    console.log("Server is listening on port :", port);
})