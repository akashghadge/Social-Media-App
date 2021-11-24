import React from 'react';
import { NavLink } from 'react-router-dom';
import { DateFormate } from '../../helper/utilities';


const Singleposthead = (props) => {
    return (
        <>
            <div className="row">
                <div className="col-3 container-center-all">
                    <img src={props.val.postedBy.PicUrl} className="user-post-small-pic" alt="profile-pic"></img>
                </div>
                <div className="col-6 d-flex align-item-center">
                    <div className="text-truncate">
                        <NavLink className="navlink-post-profile" exact to={`/profile/${props.val.postedBy._id}`}>
                            <h6 className="navlink-post-profile mb-0">{props.val.postedBy.username}</h6>
                        </NavLink>
                        <p className="full-name-post-profile">{`${props.val.postedBy.fname} ${props.val.postedBy.lname}`}</p>
                    </div>
                </div>
                <div className="col-3 container-center-all">
                    <p className="date-post">{DateFormate(props.val.created)}</p>
                </div>
            </div>
        </>
    );
}

export default Singleposthead;
