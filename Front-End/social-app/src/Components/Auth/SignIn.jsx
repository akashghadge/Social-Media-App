import React, { useState } from "react"
import axios from "axios"
import { useHistory, NavLink } from "react-router-dom";
// mui
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
const SignIn = () => {
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    let history = useHistory();
    let [allCurrentData, setAllCurrentData] = useState({
        username: "",
        password: ""
    });
    function inputChange(event) {
        const { id, value } = event.target
        // console.log(id, value);
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [id]: value
            }
        })
    }


    function SendUser(event) {
        event.preventDefault()
        axios.post("http://localhost:5000/api/user/in", {
            username: allCurrentData.username,
            password: allCurrentData.password
        })
            .then((data) => {
                let token = data.data.jwt;
                localStorage.setItem("token", token);
                setAllCurrentData({
                    username: "",
                    password: ""
                })
                setSnackbarObj({ text: `hello ${allCurrentData.username}`, backgroundColor: "green" })
                setOpen(true);
                history.push("/profile");
            })
            .catch((err) => {
                // axios error or some bug isssue
                setSnackbarObj({ text: err.response.data, backgroundColor: "red" })
                setOpen(true);
            })

    }

    return (
        <>
            <div className="container my-5 px-5">
                <h1 className="signInHeding">Sign In</h1>
                <div className="row widthSignIn my-4" style={{ wordSpacing: "10px" }}>
                    <div className="mb-3 signInUpText mx-1">
                        <label >UserName</label>
                        <input type="text" className="form-control inputFieldSignInUp" id="username" placeholder="akash@3" onChange={inputChange} value={allCurrentData.username} required style={{ boxShadow: "none" }}></input>
                    </div>
                    <div className="mb-3 signInUpText">
                        <label >Password</label>
                        <input type="password" className="form-control inputFieldSignInUp" id="password" onChange={inputChange} value={allCurrentData.password} required style={{ boxShadow: "none" }}></input>
                    </div>
                </div>
                <div className="my-3 mx-2">
                    <button id="addContactUs " className="" onClick={SendUser}>Save</button>
                </div>
            </div>
            <div>
                <NavLink to="/forget-password">
                    Forget Password
                </NavLink>
            </div>

            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default SignIn;
