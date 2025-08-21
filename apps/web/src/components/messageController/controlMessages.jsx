import { useEffect, useState } from "react";
import GetMessages from "../messageController/getMessages";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";
import SignalRPost from "../signalR/signalR";

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

function ControlMessages(userId = null){
    const [messages, setMessages] = useState([]);
    const [emojis, setEmojis] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);

    const fetchMessages = async () => {
        const data = await GetMessages(userId);
        if (data) setMessages(data);
    };

    const fetchEmojis = async () => {
        const data = await fetchMethodGet("http://localhost:5000/api/emoji/allemojisforuser");
        if (data) setEmojis(data);
    };

    const fetchUsers = async () => {
        const data = await fetchMethodGet("http://localhost:5000/api/user/getallusers");
        if (data) setUsers(data);
    };

    const fetchBookmarks = async () => {
        const data = await fetchMethodGet("http://localhost:5000/api/bookmark/getallbookmarksforuser");
        if (data) setBookmarks(data);
    };

    useEffect(() => {
        const fetchAll = async () => {
            await fetchMessages();
            await fetchEmojis();
            await fetchUsers();
            await fetchBookmarks();
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

        return () => {
            connection.off("messages");
            connection.off("updateEmojiForMessage");
        };
    }, [userId]);

    return {messages, emojis, users, bookmarks};
}

export default ControlMessages;