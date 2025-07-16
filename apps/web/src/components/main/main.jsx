import React, {useEffect, useState} from "react";
import MessageCard from "../messageCard/messageCard";
import {Link} from "react-router-dom";

function Main(){
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/message/getmessages")
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch(err => {
                    console.error('Error:', err.message);
            });
    }, []);

    return(
        <div>
            <h1>Choose</h1>
            <Link to={"/addPost"}>Add Post</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
            <Link to={"/changePassword"}>Change Password</Link>
            <Link to={"/userProfile"}>Profile</Link>
            <Link to={"/additionalUserSettings"}>Settings</Link>
            <h2>Messages: </h2>
            {messages && messages.map(msg => (
                <MessageCard key={msg.messageId} message={msg} />
            ))}
        </div>
    );
}

export default Main;