import React from 'react';
import { NavLink } from 'react-router-dom';
const Pagebreadcrumb = (props) => {
    return (
        <>
            <div className="p-4 bg-transparent">
                <div className="page-header">
                    <h2 className="heading-auth">{props.heading}</h2>
                </div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <NavLink to={`/${props.url}`} className="navlink-auth">{props.base}</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">{props.heading}</li>
                    </ol>
                </nav>
            </div>
        </>
    );
}

export default Pagebreadcrumb;
