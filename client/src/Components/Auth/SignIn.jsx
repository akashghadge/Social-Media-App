import React, { useState } from "react"
import axios from "axios"
import { useHistory, NavLink } from "react-router-dom";
// mui
// snack bar code
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from "react-loading"
const useStyles = makeStyles((theme) => ({
    profileButtonFollow: {
        color: "#0000ff",
        backgroundColor: "white",
        border: "solid 1px #0000ff",
        margin: "2rem",
        '&:hover': {
            color: "white",
            backgroundColor: "#2222ff",
        },
    }

}));
const SignIn = () => {
    const classes = useStyles();
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
                        <div className="container my-5 px-5">
                            <h1 className="signINUPHead">Sign In</h1>
                            <div className="row widthSignIn my-4" style={{ wordSpacing: "10px" }}>
                                <div className="">
                                    <span className="signINUPText">Username</span>
                                    <input type="text" className="signINUPInputFields" id="username" placeholder="akash@3" onChange={inputChange} value={allCurrentData.username} required style={{ boxShadow: "none" }}></input>
                                </div>
                                <div className="">
                                    <span className="signINUPText">Password</span>
                                    <input type="password" className="signINUPInputFields" id="password" onChange={inputChange} value={allCurrentData.password} required style={{ boxShadow: "none" }}></input>
                                </div>
                            </div>
                            <div className="my-3 mx-2">
                                <Button id="addContactUs" className={classes.profileButtonFollow} onClick={SendUser}>Save</Button>
                            </div>
                        </div>
                        <div>
                            <NavLink className="settingNavLink" to="/forget-password">
                                Forget Password
                            </NavLink>
                        </div>

                        {/* snackbar */}
                        <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                            text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
                    </>
            }
        </>
    )
}
export default SignIn;
