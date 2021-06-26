"use strict";
// inital set up of server
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const socketio = require("socket.io");


const http = require("http");
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origins: ["http://localhost:3000/"]
    }
})

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
const Chat = require("./routes/Chat.route");
const Notification = require("./routes/Notification.route");
// routes setting
app.use("/api/", EmailRoute);
app.use("/api/user", User);
app.use("/api/dashboard/", verify, Dashboard);
app.use("/api/post", Post);
app.use("/api/follow", Follow);
app.use("/api/chat", Chat);
app.use("/api/notification", Notification);
//making public images 
app.use("/public/images", express.static(__dirname + '/public'));


// socket.io things
const { main } = require("./routes/chatSocket");
main(io);


// for production use
app.use(express.static("../Front-End/social-app/build"));
const path = require("path");
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Front-End", "social-app", "build", "index.html"))
})




server.listen(port, () => {
    console.log("Server is listening on port :", port);
})