import React, {useMemo, useState} from "react";
import { Link } from "react-router-dom";
import MessageCard from "../messageCard/messageCard";
import ControlMessages from "../messageController/controlMessages";
import Select, {components} from "react-select";
import Story from "../story/story";
import {logo, sun, profile,
        following, messaging, add,
        create, gear, sparkles, pin,
        moon} from "../../images";
import { ReactComponent as SearchIcon } from "../../images/inUse/Search.svg";
import st from "./main.module.css";
import {findAllByDisplayValue} from "@testing-library/dom";

function Main() {
    const {messages, emojis, users,
          bookmarks, stories, reposts,
          addMessages, notifications} = ControlMessages(null);
    const [search, setSearch] = useState({ type: "", value: "" });
    const [isDay, setIsDay] = useState(true);

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

    const CustomDropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                <SearchIcon width={20} height={20} style={{ marginRight: '10px' }} />
            </components.DropdownIndicator>
        );
    };

    const filteredMessages = messages
        .filter(msg => msg.messageParentId === null && (msg.isStory === false || msg.isStory === null))
        .filter(msg => {
            if (!normalizedSearch || search.type !== "message") return true;
            return (
                msg.messageText?.toLowerCase().includes(normalizedSearch) ||
                msg.themes?.some(theme =>
                    theme.toLowerCase().includes(normalizedSearch)
                )
            );
        });

    const toggleTheme = () => {
        setIsDay(!isDay);
    };

    console.log(notifications);

    return (
        <div className={st.div}
            style={{ backgroundColor: isDay ?
                'rgba(250, 235, 205, 1)' :
                'rgba(67, 67, 67, 1)',}}>
            <div>
                <div className={st.leftWin}>
                    <div className={st.options}>
                        <Link to={"/interests"}
                              className={st.option}>
                            <img src={sparkles} alt=""
                                 />
                            <p>Помічник</p>
                        </Link>
                        <Link to={"/userProfile"}
                              className={st.option}>
                            <img src={profile} alt=""
                                 />
                            <p>Профіль</p>
                        </Link>
                        <Link to={"/addPost"}
                              className={st.option}>
                            <img src={create} alt=""
                                 />
                            <p>Створити</p>
                        </Link>
                        <Link
                              className={st.option}>
                            <img src={following} alt=""
                                 />
                            <p>Уподобайки</p>
                        </Link>
                        <Link to="/bookmarks"
                              className={st.option}>
                            <img src={pin} alt=""
                                 />
                            <p>Збереження</p>
                        </Link>
                        <Link to={"/additionalUserSettings"}
                              className={st.option}>
                            <img src={gear} alt=""
                                 />
                            <p>Налаштування</p>
                        </Link>
                    </div>
                </div>
                <div className={st.fidySnipy}>
                    <p>Фіди</p>
                    <hr/>
                    <p>Сніпи</p>
                </div>
                <div>
                    {notifications.map((n, index) => (
                        <div key={index} style={{ width: "500px" }}>
                            {n.follow ? (
                                <li style={{ backgroundColor: "red" }} key={n.id}>
                                    {n.user.username} follow
                                </li>
                            ) : n.repost ? (
                                <li key={n.id}>{n.message.author} repost</li>
                            ) : n.emoji ? (
                                <div>
                                    <li key={n.id}>{n.messageId} like</li>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
                <div className={st.head}>
                    <img src={logo}
                         alt="Dumka Logo"
                         />
                    <div>
                        <Select
                            options={searchOptions}
                            className={st.container}
                            classNamePrefix="search"
                            components={{
                                DropdownIndicator: CustomDropdownIndicator,
                                IndicatorSeparator: () => null}}
                            onChange={(selected) =>
                                setSearch(selected ? { type: selected.type, value: selected.value } : { type: "", value: "" })}
                            isClearable
                            placeholder="Пошук"
                        />
                    </div>
                    <nav className={st.icons}>
                        <Link onClick={toggleTheme}>
                            <img src={isDay ? sun : moon}
                                 alt="sun"/>
                        </Link>
                        <Link to="/userProfile">
                            <img src={profile}
                                 alt="profile"/>
                        </Link>
                        <Link to="/addPost">
                            <img src={add}
                                 alt="profile"/>
                        </Link>
                        <Link>
                            <img src={following}
                                 alt="profile"
                                 />
                        </Link>
                        <Link>
                            <img src={messaging}
                                 alt="profile"
                                 />
                        </Link>
                    </nav>
                </div>
                <nav>
                    <Link to="/addStory">Add Story</Link>
                </nav>


                {/*{filteredUsers.map(user => (*/}
                {/*    <UserCard key={user.id} user={user} />*/}
                {/*))}*/}

                {stories.map((story, index) => (
                    <Story key={index} story={story} />
                ))}

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
            </div>
        </div>
    );
}

export default Main;
