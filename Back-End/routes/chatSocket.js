const User = require("../models/User.model");

function main(io) {
    io.on("connection", (socket) => {
        socket.on("first-time-log", async (data) => {
            try {
                let updatedData = await User.findByIdAndUpdate(data, {
                    chatId: socket.id
                });
                console.log(socket.id);
            }
            catch (err) {
                console.log(err);
            }
        })
    })
}


module.exports = { main }