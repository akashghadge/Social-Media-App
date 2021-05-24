const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

// this is Schema of user 
const userschema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'please enter an email'],
            unique: true,
            lowercase: true,
            validate: [isEmail, 'please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'please enter an password'],
            minLength: [6, 'minimum password length is 6 charecters'],
            default:'pass@123'
        }
    })


// hashing password 
userschema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();

})

// static method for login user
// this method checks that is the email and password enter in login page is same as store in database
userschema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect Password")
    }
    throw Error('incorrect Email')
}

const User = mongoose.model("User", userschema);
module.exports = User;


