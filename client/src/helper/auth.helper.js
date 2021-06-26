import axios from "axios";
// auth code basic
const GetAuth = () => {
    return new Promise
        (function (resolve, reject) {
            const urlAuth = "/api/dashboard/me";
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