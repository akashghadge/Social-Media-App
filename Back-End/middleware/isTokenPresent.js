//this middleware checks whether the token is present in cookes if not then redirect to login
const jwt = require("jsonwebtoken")

const isTokenPresent = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'thisisaloginandsignuppage', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            }
            else {
                // console.log(decodedToken);
                console.log("Token is Present");
                next();
            }
        }
        )
    }
    else {
        res.redirect("/login");
    }
}
module.exports = {
    isTokenPresent
}