import React, { useState } from "react"
import SignUp from "./SignUp";
import SignIn from "./SignIn"
const Sign = () => {
    let [signButtonState, signButtonSetState] = useState(1);
    function changeButtonSign(e) {
        signButtonSetState(Number(e.target.value));
        console.log(signButtonState);
    }
    return (
        <>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button className="signButton" name="signup" value="0" onClick={changeButtonSign}>Sign Up</button>
                <button className="signButton" name="signin" value="1" onClick={changeButtonSign}>Sign In</button>
                {signButtonState ? <SignIn></SignIn> : <SignUp></SignUp>}
            </div>
        </>
    )
}
export default Sign;
