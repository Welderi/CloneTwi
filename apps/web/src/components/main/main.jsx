import React, { useEffect, useState } from "react";
import MessageCard from "../messageCard/messageCard";
import { Link } from "react-router-dom";
import SignalR from "../signalR/signalR";

function Main() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/message/getgroupedmessages", {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                const normalizeParents = (msgs) => {
                    return msgs.map(msg => ({
                        ...msg,
                        parents: Array.isArray(msg.parents) ? normalizeParents(msg.parents) : []
                    }));
                };

                setMessages(normalizeParents(data)); // ✅ правильный вызов
            })
            .catch(err => {
                console.error("Error:", err.message);
            });

        const addReply = (msgs, newMsg) => {
            return msgs.map(msg => {
                if (msg.messageId === newMsg.messageParentId) {
                    return {
                        ...msg,
                        parents: Array.isArray(msg.parents) ? [newMsg, ...msg.parents] : [newMsg]
                    };
                } else if (Array.isArray(msg.parents) && msg.parents.length > 0) {
                    return {
                        ...msg,
                        parents: addReply(msg.parents, newMsg)
                    };
                } else {
                    return msg;
                }
            });
        };

        const connection = SignalR((data) => {
            const newMessage = data.value;
            setMessages(prevMessages => {
                if (newMessage.messageParentId == null) {
                    return [newMessage, ...prevMessages];
                } else {
                    return addReply(prevMessages, newMessage);
                }
            });
        });

        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div>
            <h1>Choose</h1>
            <Link to={"/addPost"}>Add Post</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
            <Link to={"/changePassword"}>Change Password</Link>
            <Link to={"/userProfile"}>Profile</Link>
            <Link to={"/additionalUserSettings"}>Settings</Link>
            <h2>Messages: </h2>
            {messages
                .filter(msg => msg.messageParentId === null)
                .map(msg => (
                    <MessageCard key={msg.messageId} message={msg}/>
                ))}
        </div>
    );
}

export default Main;
