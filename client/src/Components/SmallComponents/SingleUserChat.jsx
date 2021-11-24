import React from 'react';

const Singleuserchat = (props) => {
    function listClasses(username) {
        let classes = "shadow-sm p-3 cursor-pointer m-3 text-truncate";
        if (username === props.chatUser)
            classes += " active-chat-member"
        else
            classes += " ";
        return classes;
    }
    return (
        <>
            <li className={listClasses(props.username)} value={props.id} onClick={(e) => { props.changeChatUser(e, props.id, props.username) }}>
                {props.username}
            </li>
        </>
    );
}

export default Singleuserchat;
