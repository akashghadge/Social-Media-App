"use strict";
// inital set up of server
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// must needed packages
const cros = require("cors");
require("dotenv").config();
require("./db/conn");
const cookieParser = require("cookie-parser");
const router=require('./routes/authorization');


// middlewares
app.use(express.json());
app.use(cros());
app.use(cookieParser());

// const EmailRoute = require("./routes/Email.route");
// app.use("/api/", EmailRoute);


app.get("/",(req,res)=>{
    res.send("This is homepage");
})

app.use(router);

app.listen(port, () => {
    console.log("Server is listening on port :", port);
})