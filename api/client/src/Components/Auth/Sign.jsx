import React, { useState } from "react"
import SignUp from "./SignUp";
import SignIn from "./SignIn"
import loginSrc from "../../assets/images/login.jpg"
const Sign = () => {
    let [signButtonState, signButtonSetState] = useState(1);
    function changeButtonSign(e) {
        signButtonSetState(e);
    }
    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 px-0" >
                    <img src={loginSrc} className="img-fluid d-none d-md-block h-100"></img>
                </div>
                <div className="col-12 col-md-6 bg-transparent">
                    <div className="text-center">
                        <button className="btn btn-outline-default active" name="signup" aria-pressed="true" value="0" onClick={(e) => changeButtonSign(0)}>Sign Up</button>
                        <button className="btn btn-outline-default active" aria-pressed="true" name="signin" value="1" onClick={(e) => changeButtonSign(1)}>Sign In</button>
                    </div>
                    <div className="card m-3">
                        <div className="card-body">
                            {
                                signButtonState === 1 ? <SignIn /> : <SignUp />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Sign;
