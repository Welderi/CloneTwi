import React, { useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import st from "./searchResults.module.css";
import { person } from "../../images";

function SearchResults({
                           users = [],
                           messages = [],
                           query = "",
                           activeTab = "messages",
                           onChangeTab,
                           onClose,
                           onSelect
                       }) {
    const rootRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                onClose?.();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    const q = (query || "").trim().toLowerCase();

    const filteredUsers = useMemo(() => {
        if (!q) return users || [];
        return (users || []).filter(u =>
            (u.userName || u.username || "").toLowerCase().includes(q)
        );
    }, [users, q]);

    const baseMessages = useMemo(() => {
        return (messages || []).filter(m => m.messageParentId === null);
    }, [messages]);

    const filteredMessages = useMemo(() => {
        if (!q) return baseMessages;
        return baseMessages.filter(m =>
            (m.messageText || "").toLowerCase().includes(q) ||
            (m.themes || []).some(t => t.toLowerCase().includes(q))
        );
    }, [baseMessages, q]);

    const allThemes = useMemo(() => {
        const set = new Set((messages || []).flatMap(m => m.themes || []));
        return Array.from(set);
    }, [messages]);

    const filteredThemes = useMemo(() => {
        if (!q) return allThemes;
        return allThemes.filter(t => t.toLowerCase().includes(q));
    }, [allThemes, q]);

    return (
        <div ref={rootRef} className={st.searchResults}>
            <div className={st.tabs}>
                <button
                    className={activeTab === "users" ? st.active : ""}
                    onClick={() => onChangeTab?.("users")}
                >
                    Облікові записи
                </button>

                <button
                    className={activeTab === "messages" ? st.active : ""}
                    onClick={() => onChangeTab?.("messages")}
                >
                    Фіди
                </button>

                <button
                    className={activeTab === "themes" ? st.active : ""}
                    onClick={() => onChangeTab?.("themes")}
                >
                    Слова-ключі
                </button>

                {/*<button*/}
                {/*    className={activeTab === "locations" ? st.active : ""}*/}
                {/*    onClick={() => onChangeTab?.("locations")}*/}
                {/*>*/}
                {/*    Локації*/}
                {/*</button>*/}
            </div>

            <div className={st.resultsList}>
                {activeTab === "users" && (
                    <>
                        {filteredUsers.length === 0 ? (
                            <div className={st.empty}>Нічого не знайдено</div>
                        ) : (
                            filteredUsers.map(user => (
                                <Link
                                    key={user.id}
                                    to={`/userProfile`}
                                    state={user}
                                    onClick={onClose}
                                    className={st.resultLink}
                                >
                                    <div className={st.userRow}>
                                        <img
                                            src={user.profileImageUrl ? `http://localhost:5000${user.profileImageUrl}` : person}
                                            alt=""
                                            className={st.avatar}
                                        />
                                        <div>
                                            <p className={st.userName}>{user.userName ?? user.username}</p>
                                            <span className={st.userBio}>{user.bio}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </>
                )}

                {activeTab === "messages" && (
                    <>
                        {filteredMessages.length === 0 ? (
                            <div className={st.empty}>Нічого не знайдено</div>
                        ) : (
                            filteredMessages.map(msg => (
                                <div
                                    key={msg.messageId}
                                    className={st.messageRow}
                                    onClick={() => {
                                        onSelect?.({ type: "message", value: msg.messageText || "" });
                                        onClose?.();
                                    }}
                                >
                                    <p className={st.messageText}>{msg.messageText}</p>
                                    {msg.themes?.length > 0 && (
                                        <div className={st.messageThemes}>
                                            {msg.themes.slice(0, 3).map((t, i) => (
                                                <span key={i} className={st.themeTag}>{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </>
                )}

                {activeTab === "themes" && (
                    <>
                        {filteredThemes.length === 0 ? (
                            <div className={st.empty}>Нічого не знайдено</div>
                        ) : (
                            filteredThemes.map((theme, i) => (
                                <div
                                    key={i}
                                    className={st.themeTag}
                                    onClick={() => {
                                        onSelect?.({ type: "theme", value: theme });
                                        onClose?.();
                                    }}
                                >
                                    {theme}
                                </div>
                            ))
                        )}
                    </>
                )}

                {/*{activeTab === "locations" && (*/}
                {/*    <div className={st.empty}>Локацій поки немає</div>*/}
                {/*)}*/}
            </div>
        </div>
    );
}

export default SearchResults;
