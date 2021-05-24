// database connections
const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGO_URI 
// || "mongodb://localhost:27017/jwt";
mongoose.connect(uri, {
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