import React, { useState } from "react"
import axios from "axios"
import { useHistory, NavLink } from "react-router-dom";
// mui
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ReactLoading from "react-loading"
const SignIn = () => {
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [loading, setLoading] = useState(false);
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
        setLoading(true);
        axios.post("/api/user/in", {
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
                setLoading(false);
                history.push("/profile");
            })
            .catch((err) => {
                // axios error or some bug isssue
                setSnackbarObj({ text: err.response.data, backgroundColor: "red" })
                setOpen(true);
                setLoading(false);
            })

    }

    return (
        <>
            {
                loading ? <>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                    </div>
                </> :
                    <>
                        <h1 className="heading-auth mt-2 mb-4">Sign In</h1>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="username" placeholder="akash@3" onChange={inputChange} value={allCurrentData.username} required></input>
                            <label htmlFor="username">Enter Username</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="password" onChange={inputChange} placeholder="*" value={allCurrentData.password} required></input>
                            <label htmlFor="password">Enter Password</label>
                        </div>
                        <div className="d-flex justify-content-center mb-3">
                            <button className="btn btn-default d-block w-50" onClick={SendUser}>Login</button>
                        </div>
                        <NavLink className="navlink-auth d-block" to="/forget-password">
                            Forget Password
                        </NavLink>



                        {/* snackbar */}
                        <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                            text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
                    </>
            }
        </>
    )
}
export default SignIn;
