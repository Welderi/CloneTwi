import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MessageCard from "../messageCard/messageCard";
import SignalRPost from "../signalR/signalR";

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

function Main() {
    const [messages, setMessages] = useState([]);
    const [emojis, setEmojis] = useState([]);

    const fetchMessages = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/message/getgroupedmessages", { credentials: "include" });
            const data = await res.json();
            setMessages(normalizeParents(data));
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const fetchEmojis = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/emoji/allemojisforuser", { credentials: "include" });
            const data = await res.json();
            setEmojis(data);
        } catch (err) {
            console.error("Error fetching emojis:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchEmojis();

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
