// database connections
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
mongoose.connect(uri || "mongodb://localhost/social-media-app", {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false
}).then((data) => {
    console.log("DB is connected..");
}).catch((err) => {
    console.log(err);
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Database connected sucessfully");
})


