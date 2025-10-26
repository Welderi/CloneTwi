import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MessageCard from "../messageCard/messageCard";
import ControlMessages from "../messageController/controlMessages";
import Story from "../story/story";
import { useTheme } from "../../context/ThemeContext";
import {
    logo, sun, profile,
    following, messaging, add,
    create, gear, sparkles, pin,
    moon, person, searchIcon
} from "../../images";
import st from "./main.module.css";
import SearchResults from "./searchResults";

function Main() {
    const {
        messages = [],
        emojis = [],
        users = [],
        bookmarks = [],
        stories = [],
        reposts = [],
        addMessages = [],
        notifications = []
    } = ControlMessages(null);

    const [search, setSearch] = useState({ type: "", value: "" });
    const { isDay, setIsDay } = useTheme();
    const [isNotOpen, setIsNotOpen] = useState(false);
    const [viewMode, setViewMode] = useState("feeds");
    const [showResults, setShowResults] = useState(false);
    const [searchTab, setSearchTab] = useState("users");

    const normalizedSearch = (search.value || "").trim().toLowerCase();

    const baseMessages = useMemo(() => {
        return (messages || []).filter(
            msg => msg.messageParentId === null && (msg.isStory === false || msg.isStory === null)
        );
    }, [messages]);

    let filteredMessages = baseMessages;
    if (normalizedSearch) {
        const matched = baseMessages.filter(msg =>
            (msg.messageText || "").toLowerCase().includes(normalizedSearch) ||
            (msg.themes || []).some(t => t.toLowerCase().includes(normalizedSearch))
        );

        if (matched.length > 0) {
            filteredMessages = matched;
        } else {
            filteredMessages = baseMessages;
        }
    }

    const handleSelect = (item) => {
        if (!item) return;
        if (item.type === "message" || item.type === "theme") {
            setSearch({ type: "message", value: item.value });
        } else if (item.type === "user") {
            setSearch({ type: "user", value: item.value });
        }
        setShowResults(false);
    };

    return (
        <div className={st.div}>
            <div>
                <div className={st.leftWin}>
                    <div className={st.options}>
                        <Link to={"/interests"} className={st.option}>
                            <img src={sparkles} alt=""/>
                            <p>Помічник</p>
                        </Link>

                        <Link to={"/userProfile"} className={st.option}>
                            <img src={profile} alt=""/>
                            <p>Профіль</p>
                        </Link>

                        <Link to={"/addPost"} className={st.option}>
                            <img src={create} alt=""/>
                            <p>Створити</p>
                        </Link>

                        {/*<Link className={st.option}>*/}
                        {/*    <img src={following} alt=""/>*/}
                        {/*    <p>Уподобайки</p>*/}
                        {/*</Link>*/}

                        <Link to="/bookmarks" className={st.option}>
                            <img src={pin} alt=""/>
                            <p>Збереження</p>
                        </Link>

                        <Link to={"/additionalUserSettings"} className={st.option}>
                            <img src={gear} alt=""/>
                            <p>Налаштування</p>
                        </Link>
                    </div>
                </div>

                <div className={st.fidySnipy}>
                    <p
                        className={viewMode === "feeds" ? st.active : st.inactive}
                        onClick={() => setViewMode("feeds")}
                    >
                        Фіди
                    </p>

                    <hr className={st.divider} />

                    <p
                        className={viewMode === "snips" ? st.active : st.inactive}
                        onClick={() => setViewMode("snips")}
                    >
                        Сніпи
                    </p>
                </div>

                <div className={st.rightWin} style={{ visibility: isNotOpen ? "visible" : "hidden" }}>
                    <div className={st.options}>
                        {notifications.map((n, index) => (
                            <div key={index} className={st.notifications}>
                                {n.follow && (
                                    <Link key={n.id} to={`/userProfile`} state={n.user}>
                                        <div className={st.not}>
                                            <div className={st.avDiv}>
                                                <img
                                                    src={n.user.profileImageUrl ? `http://localhost:5000${n.user.profileImageUrl}` : person}
                                                    alt="person"
                                                />
                                            </div>
                                            <div className={st.col}>
                                                <p>{n.user.userName}</p>
                                                <p>Приєднується до ваших оновлень</p>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                                {n.repost && (
                                    <Link key={n.id} to={`/userProfile`} state={n.user}>
                                        <div className={st.not}>
                                            <div className={st.avDiv}>
                                                <img
                                                    src={n.user.profileImageUrl ? `http://localhost:5000${n.user.profileImageUrl}` : person}
                                                    alt="person"
                                                />
                                            </div>
                                            <div className={st.col}>
                                                <p>{n.user.userName}</p>
                                                <p>Поширив(-ла) вашу думку</p>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                                {n.emoji && (
                                    <Link key={n.id} to={`/userProfile`} state={n.user}>
                                        <div className={st.not}>
                                            <div className={st.avDiv}>
                                                <img
                                                    src={n.user.profileImageUrl ? `http://localhost:5000${n.user.profileImageUrl}` : person}
                                                    alt="person"
                                                />
                                            </div>
                                            <div className={st.col}>
                                                <p>{n.user.userName}</p>
                                                <p>Вподобав(-ла) вашу думку</p>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={st.scrollFade}></div>
                </div>

                <div className={st.head}>
                    <img src={logo} alt="Dumka Logo" />
                    <div>
                        <div className={st.searchWrapper} style={{ position: "relative" }}>
                            <input
                                type="text"
                                value={search.value}
                                onFocus={() => setShowResults(true)}
                                onChange={(e) => {
                                    setSearch({ type: "", value: e.target.value });
                                    setShowResults(true);
                                }}
                                placeholder="Пошук"
                                className={st.searchInput}
                            />
                            <img src={searchIcon} alt="Search" className={st.searchIcon} />
                            {showResults && (
                                <SearchResults
                                    users={users}
                                    messages={baseMessages}
                                    query={search.value}
                                    activeTab={searchTab}
                                    onChangeTab={setSearchTab}
                                    onClose={() => setShowResults(false)}
                                    onSelect={(item) => handleSelect(item)}
                                />
                            )}
                        </div>
                    </div>

                    <nav className={st.icons}>
                        <Link onClick={() => setIsDay(!isDay)}>
                            <img src={isDay ? sun : moon}
                                 alt="theme"/>
                        </Link>

                        <Link to="/userProfile">
                            <img src={profile} alt="profile" />
                        </Link>

                        <Link to="/addPost">
                            <img src={add} alt="add" />
                        </Link>

                        {/*<Link>*/}
                        {/*    <img src={following} alt="following" />*/}
                        {/*</Link>*/}

                        <div className={st.notificationWrapper}>
                            <Link onClick={() => setIsNotOpen(prev => !prev)}>
                                <img src={messaging} alt="messages"/>
                                {notifications.length > 0 && (
                                    <span className={st.badge}>{notifications.length}</span>
                                )}
                            </Link>
                        </div>

                    </nav>
                </div>

                <br/>

                {viewMode === "snips" &&
                    <div className={st.msgDiv}>
                        <Story stories={stories} />
                    </div>
                }

                {viewMode === "feeds" &&
                    <div className={st.msgDiv}>
                        {addMessages?.messages?.map(msg => (
                            <MessageCard
                                key={msg.messageId}
                                message={msg}
                                emoji={emojis.filter(e => e.messageId === msg.messageId)}
                                allEmojis={emojis}
                                bookmarkBool={bookmarks.some(e => e.messageId === msg.messageId)}
                                repostBool={reposts.some(e => e.messageId === msg.messageId)}
                            />
                        ))}

                        {filteredMessages.map(msg => (
                            <MessageCard
                                key={msg.messageId}
                                message={msg}
                                emoji={emojis.filter(e => e.messageId === msg.messageId)}
                                allEmojis={emojis}
                                bookmarkBool={bookmarks.some(e => e.messageId === msg.messageId)}
                                repostBool={reposts.some(e => e.messageId === msg.messageId)}
                            />
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}

export default Main;
