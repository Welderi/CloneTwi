import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MessageCard from "../messageCard/messageCard";
import SignalRPost from "../signalR/signalR";
import UserCard from "../userCard/userCard";

const normalizeParents = (msgs) =>
    msgs.map(msg => ({
        ...msg,
        parents: Array.isArray(msg.parents) ? normalizeParents(msg.parents) : []
    }));

const addReply = (msgs, newMsg) =>
    msgs.map(msg =>
        msg.messageId === newMsg.messageParentId
            ? {...msg, parents: [newMsg, ...(msg.parents || [])]}
            : msg.parents?.length
                ? {...msg, parents: addReply(msg.parents, newMsg)}
                : msg
    );

const updateMessageEmojis = (messages, messageId, emojisData) =>
    messages.map(msg =>
        msg.messageId === messageId
            ? { ...msg, emojis: emojisData }
            : msg.parents?.length
                ? { ...msg, parents: updateMessageEmojis(msg.parents, messageId, emojisData) }
                : msg
    );

const fetchMethod = async (url) => {
    try {
        const res = await fetch(url, {credentials: "include"});
        return await res.json();
    } catch (err){
        console.error("Error fetching:", err);
        return null;
    }
};

function Main() {
    const [messages, setMessages] = useState([]);
    const [emojis, setEmojis] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchMessages = async () => {
        const data = await fetchMethod("http://localhost:5000/api/message/getgroupedmessages");
        if (data) setMessages(normalizeParents(data));
    };

    const fetchEmojis = async () => {
        const data = await fetchMethod("http://localhost:5000/api/emoji/allemojisforuser");
        if (data) setEmojis(data);
    };

    const fetchUsers = async () => {
        const data = await fetchMethod("http://localhost:5000/api/user/getallusers");
        if (data) setUsers(data);
    };

    useEffect(() => {
        const fetchAll = async () => {
            await fetchMessages();
            await fetchEmojis();
            await fetchUsers();
        };

        fetchAll();

        const connection = SignalRPost();

        connection.on("messages", (newMessage) => {
            setMessages(prev => {
                return newMessage.messageParentId === null
                    ? [newMessage, ...prev]
                    : addReply(prev, newMessage);
            });
        });

        connection.on("updateEmojiForMessage", (messageId, emojiData) => {
            setMessages(prev => updateMessageEmojis(prev, messageId, emojiData.emojis));

            setEmojis(prev => {
                const withoutOld = prev.filter(e => e.messageId !== messageId);
                return emojiData.emoji ? [...withoutOld, emojiData.emoji] : withoutOld;
            });
        });

        return () => connection.stop();
    }, []);

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
