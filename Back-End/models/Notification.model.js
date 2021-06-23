const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// here i am creating new schema where i store users email and otp associat to it
const NotificationsSchema = new Schema
    ({

        userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
        notification:
        {
            type: String
        },
        createdAt: { type: Date, expires: 86400, default: Date.now() }
    })

const Notification = mongoose.model("Notification", NotificationsSchema);
module.exports = Notification;
