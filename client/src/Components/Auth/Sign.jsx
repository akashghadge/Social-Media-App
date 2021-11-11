import React, { useState } from "react"
import SignUp from "./SignUp";
import SignIn from "./SignIn"
const Sign = () => {
    let [signButtonState, signButtonSetState] = useState("");
    function changeButtonSign(e) {
        signButtonSetState(e);
    }
    return (
        <>
            <div className="text-center">
                <button className="btn btn-outline-primary" name="signup" value="0" onClick={(e) => changeButtonSign(0)}>Sign Up</button>
                <button className="btn btn-outline-primary" name="signin" value="1" onClick={(e) => changeButtonSign(1)}>Sign In</button>
            </div>
            {
                signButtonState === 1 ? <SignIn /> : <SignUp />
            }
        </>
    )
}
export default Sign;
