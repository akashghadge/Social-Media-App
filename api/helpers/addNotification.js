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
                    resolve(data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
}


module.exports = addNote;



