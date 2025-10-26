import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import st from "./more.module.css";
import { today, pin, repostIcon } from "../../images";
import fetchMethodPost from "../fetchMethods/fetchMethodPost";
import useFollowController from "../userCard/followController";

function More({ message, bookmarkBool, repostBool, user, isItMe, onClose }) {
    const [bookmark, setBookmark] = useState(bookmarkBool);
    const [repost, setRepost] = useState(repostBool);

    const { follow, unfollow, isFollowed } = useFollowController(user);

    useEffect(() => {
        setBookmark(bookmarkBool);
        setRepost(repostBool);
    }, [bookmarkBool, repostBool]);

    const addBookmark = async () => {
        const form = new FormData();
        form.append("MessageId", message.messageId);
        await fetchMethodPost("http://localhost:5000/api/bookmark/addbookmark", form);
        setBookmark(true);
    };

    const removeBookmark = async (messageId) => {
        await fetch(`http://localhost:5000/api/bookmark/removebookmark/${messageId}`, {
            method: "DELETE",
            credentials: "include",
        });
        setBookmark(false);
    };

    const addRepost = async () => {
        const form = new FormData();
        form.append("MessageId", message.messageId);
        await fetchMethodPost("http://localhost:5000/api/repost/addrepost", form);
        setRepost(true);
    };

    const removeRepost = async (messageId) => {
        await fetch(`http://localhost:5000/api/repost/removerepost/${messageId}`, {
            method: "DELETE",
            credentials: "include",
        });
        setRepost(false);
    };

    return (
        <div className={st.wrapper}>
            {/* крестик закрытия */}
            <button className={st.closeBtn} onClick={onClose}>
                ×
            </button>

            <div className={st.topRow}>
                <button
                    className={st.bookmark}
                    onClick={async () => {
                        if (!bookmark) {
                            await addBookmark();
                        } else {
                            await removeBookmark(message.messageId);
                        }
                    }}
                >
                    <div className={st.hover}>
                        <div className={st.circle}>
                            {!bookmark ? <img src={pin} alt="pin" /> : <img src={today} alt="today" />}
                        </div>
                        <p>Зберегти</p>
                    </div>
                </button>

                <button
                    className={st.bookmark}
                    onClick={async () => {
                        if (!repost) {
                            await addRepost();
                        } else {
                            await removeRepost(message.messageId);
                        }
                    }}
                >
                    <div className={st.hover}>
                        <div className={st.circle}>
                            <img src={repostIcon} alt="repost" />
                        </div>
                        <p>Репост</p>
                    </div>
                </button>
            </div>

            <div className={st.bottomColumn}>
                {!isItMe && (
                    <button
                        className={st.textButton}
                        onClick={isFollowed ? unfollow : follow}
                    >
                        {isFollowed ? "Від'єднатися від оновлень" : "Доєднатися до оновлень"}
                    </button>
                )}

                <Link
                    to={`/userProfile`}
                    state={isItMe ? null : user}
                    className={st.textButton}
                >
                    Про користувача
                </Link>
            </div>
        </div>
    );
}

export default More;
