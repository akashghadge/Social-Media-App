import React from "react"
import { NavLink } from "react-router-dom"

import Home from "@material-ui/icons/Home"
import { AccountBox, AddBox } from "@material-ui/icons"


const Navbar = () => {
    return (
        <>
            <nav className="">
                <a className="" href="/ ">Social Media</a>
                <button className="" type="button" data-toggle="collapse" data-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarsExample09">
                    <ul className="navbar-nav mr-auto p-1 mx-3">
                        <li className="nav-item">
                            <NavLink exact to="/" className="nav-link navIcon">
                                <Home className="navIcon"></Home>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/sign" className="nav-link ">
                                <AccountBox className="navIcon"></AccountBox>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/match-otp" className="nav-link">
                                <AddBox></AddBox>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}
export default Navbar;
