import React from 'react';
import { Notifications, Message, PostAdd, AccountBox } from "@material-ui/icons"
import { NavLink } from 'react-router-dom';
const Activities = () => {
    return (
        <div className="card b-radius-card mx-2 mt-3">
            <div className="card-body">
                <h5 className="heading-home text-center p-2">Activities </h5>
                <hr></hr>
                <div className="text-center">
                    <NavLink to="/profile">
                        <button className="btn btn-outline-default btn-activity">
                            <AccountBox></AccountBox>
                            <span className="d-block">Profile</span>
                        </button>
                    </NavLink>
                    <NavLink to="/notifications">
                        <button className="btn btn-outline-default btn-activity">
                            <Notifications></Notifications>
                            <span className="d-block">Notify</span>
                        </button>
                    </NavLink>
                    <NavLink to="/messages">
                        <button className="btn btn-outline-default btn-activity">
                            <Message></Message>
                            <span className="d-block">Messages</span>
                        </button>
                    </NavLink>
                    <NavLink to="/create-post">
                        <button className="btn btn-outline-default btn-activity">
                            <PostAdd></PostAdd>
                            <span className="d-block">Create</span>
                        </button>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Activities;
