const Conversation = require("../models/Conversation.model");
const User = require("../models/User.model");
async function addMessageToDB(SenderId, RecId, text) {
    try {

        const filter1 = {
            SenderId: SenderId,
            RecId: RecId
        };
        let updatedData1 = await Conversation.updateOne(filter1, {
            $push: {
                chats: {
                    sender: SenderId,
                    text: text
                }
            }
        }, {
            upsert: true
        });

        const filter2 = {
            SenderId: RecId,
            RecId: SenderId
        };
        let updatedData2 = await Conversation.updateOne(filter2, {
            $push: {
                chats: {
                    sender: SenderId,
                    text: text
                }
            }
        }, {
            upsert: true
        });
    }
    catch (err) {
        console.log(err);
    }
}

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
            addMessageToDB(id, payload.recipent, payload.text);
            socket.broadcast.to(payload.recipent).emit("rec-message", {
                sender: id,
                m: payload.text
            });
        })
    })
}


module.exports = { main }