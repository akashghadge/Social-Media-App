import React, { useState } from "react"
import SignUp from "./SignUp";
import SignIn from "./SignIn"
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    signButton: {
        color: "#0000ff",
        backgroundColor: "white",
        border: "solid 1px #0000ff",
        '&:hover': {
            color: "white",
            backgroundColor: "#2222ff",
        },
    }

}));
const Sign = () => {
    const classes = useStyles();
    let [signButtonState, signButtonSetState] = useState("");
    function changeButtonSign(e) {
        signButtonSetState(e);
    }
    return (
        <>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Button className={classes.signButton} name="signup" value="0" onClick={(e) => changeButtonSign(0)}>Sign Up</Button>
                <Button className={classes.signButton} name="signin" value="1" onClick={(e) => changeButtonSign(1)}>Sign In</Button>
                {signButtonState === 1 ? <SignIn></SignIn> : <SignUp></SignUp>}
            </div>
        </>
    )
}
export default Sign;
