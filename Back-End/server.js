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


// api routers
const verify = require("./middleware/verify");
const EmailRoute = require("./routes/Email.route");
const User = require("./routes/User.route");
const Dashboard = require("./routes/Dashboard.route");
const Post = require("./routes/Post.route");
const Follow = require("./routes/Follow.route")
// routes setting
app.use("/api/", EmailRoute);
app.use("/api/user", User);
app.use("/api/dashboard/", verify, Dashboard);
app.use("/api/post", Post);
app.use("/api/follow", Follow);
//making public images 
app.use("/public/images", express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log("Server is listening on port :", port);
})