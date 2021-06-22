const User = require("../models/User.model");

function main(io) {
    io.on("connection", (socket) => {
        const id = socket.handshake.query.id;
        console.log(id);
        socket.join(id);
        socket.on("first-time-log", async (data) => {
            console.log("User logged", data._id);
        })

        socket.on("send-message", (payload) => {
            console.log(payload);
            socket.broadcast.to(payload.recipent).emit("rec-message", {
                sender: id,
                m: payload.text
            });
        })
    })
}


module.exports = { main }