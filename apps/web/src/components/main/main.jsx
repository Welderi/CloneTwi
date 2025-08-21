import React, {useMemo, useState} from "react";
import { Link } from "react-router-dom";
import MessageCard from "../messageCard/messageCard";
import UserCard from "../userCard/userCard";
import ControlMessages from "../messageController/controlMessages";
import Select from "react-select";

function Main() {
    const {messages, emojis, users, bookmarks} = ControlMessages(null);
    const [search, setSearch] = useState({ type: "", value: "" });

    const searchOptions = useMemo(() => {
        const themes = Array.from(
            new Set(messages?.flatMap(m => m.themes || []))
        ).map(t => ({
            label: t,
            value: t,
            type: "message"
        })) || [];

        return [
            ...(users?.map(u => ({ label: u.userName, value: u.userName, type: "user" })) || []),

            ...(messages
                ?.filter(m => m.messageParentId === null && m.messageText?.trim())
                .map(m => ({
                    label: m.messageText,
                    value: m.messageText,
                    type: "message"
                })) || []),

            ...themes
        ];
    }, [users, messages]);

    const normalizedSearch = search.value.toLowerCase();

    const filteredUsers = users.filter(user => {
        if (!normalizedSearch || search.type !== "user") return true;
        return user.userName?.toLowerCase().includes(normalizedSearch);
    });

    const filteredMessages = messages
        .filter(msg => msg.messageParentId === null)
        .filter(msg => {
            if (!normalizedSearch || search.type !== "message") return true;
            return (
                msg.messageText?.toLowerCase().includes(normalizedSearch) ||
                msg.themes?.some(theme =>
                    theme.toLowerCase().includes(normalizedSearch)
                )
            );
        });


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
                <Link to="/bookmarks">Bookmarks</Link>
            </nav>

            <div>
                <Select
                    options={searchOptions}
                    onChange={(selected) =>
                        setSearch(selected ? { type: selected.type, value: selected.value } : { type: "", value: "" })}
                    isClearable
                    placeholder="Search users, posts, themes..."
                />
            </div>

            <h2>Users:</h2>
            {filteredUsers.map(user => (
                <UserCard key={user.id} user={user} />
            ))}

            <h2>Messages:</h2>
            {filteredMessages.map(msg => (
                <MessageCard
                    key={msg.messageId}
                    message={msg}
                    emoji={emojis.filter(e => e.messageId === msg.messageId)}
                    allEmojis={emojis}
                    bookmarkBool={bookmarks.some(e => e.messageId === msg.messageId)}
                />
            ))}
        </div>
    );
}

export default Main;
