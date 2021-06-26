const Notification = require("../models/Notification.model");

const addNote = (obj) => {
    return new Promise
        (function (resolve, reject) {
            const userId = obj.ID;
            const notification = obj.note;
            let newNote = new Notification({
                userId: userId,
                notification: notification
            });
            newNote.save()
                .then((data) => {
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                })
        })
}


module.exports = addNote;



