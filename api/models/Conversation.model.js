const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// here i am creating new schema where i store users email and otp associat to it
const ConvSchema = new Schema
    ({
        SenderId:
        {
            type: mongoose.Schema.ObjectId, ref: 'User'
        },
        RecId:
        {
            type: mongoose.Schema.ObjectId, ref: 'User'
        },
        chats
            : [
                {
                    text: { type: String },
                    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
                    created: {
                        type: Date,
                        default: Date.now
                    }

                }
            ]
    }, { timestamps: true })
const Conversation = mongoose.model("Conv", ConvSchema);
module.exports = Conversation;
