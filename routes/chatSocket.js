// socket.io code sepration
const Conversation = require("../models/Conversation.model");
async function addMessageToDB(SenderId, RecId, text) {
    try {
        const filter1 = {
            SenderId: SenderId,
            RecId: RecId
        };
        await Conversation.updateOne(filter1, {
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
        await Conversation.updateOne(filter2, {
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
        const username = socket.handshake.query.username;
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
                text: payload.text,
                created: Date.now()
            });
        })


        socket.on("typing", (payload) => {
            socket.broadcast.to(payload).emit("rec-typing", {
                username: username,
                id: id
            });
        })
    })
}


module.exports = { main }