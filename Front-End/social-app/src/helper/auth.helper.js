import axios from "axios";
// auth code basic
const GetAuth = () => {
    return new Promise
        (function (resolve, reject) {
            const urlAuth = "http://localhost:5000/api/dashboard/me";
            let token = localStorage.getItem("token");
            axios
                .post(urlAuth, {
                    token: token
                })
                .then((data) => {
                    resolve(data.data);
                })
                .catch((err) => {
                    reject(err);
                })
        })
}

export default GetAuth;