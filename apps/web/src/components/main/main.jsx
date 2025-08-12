import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MessageCard from "../messageCard/messageCard";
import UserCard from "../userCard/userCard";
import ControlMessages from "../messageController/controlMessages";

function Main() {
    const {messages, emojis, users} = ControlMessages(null);

    return (
        <div>
            <h1>Choose</h1>
            <nav>
                <Link to="/addPost">Add Post</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/changePassword">Change Password</Link>
                <Link to="/userProfile">Profile</Link>
                <Link to="/additionalUserSettings">Settings</Link>
            </nav>

            <h2>Users: </h2>

            {users
                .map(user => (
                    <UserCard key={user.id} user={user}/>
                ))
            }

            <h2>Messages:</h2>
            {messages
                .filter(msg => msg.messageParentId === null)
                .map(msg => (
                    <MessageCard
                        key={msg.messageId}
                        message={msg}
                        emoji={emojis.filter(e => e.messageId === msg.messageId)}
                        allEmojis={emojis}
                    />
                ))}
        </div>
    );
}

export default Main;
