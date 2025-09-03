import React, { useState, useEffect } from "react";
import { ReactComponent as FavoriteIcon } from "../../../images/message/favorite.svg";
import {ReactComponent as LikeIcon} from "../../../images/message/Love.svg";
import st from "./emoji.module.css";

function Emoji({ emoji, message }) {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        setLiked(emoji?.some(e => e.emojiType === "❤️"));
    }, [emoji]);

    const addEmoji = async (emojiType) => {
        await fetch("http://localhost:5000/api/emoji/addemoji", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ EmojiType: emojiType, MessageId: message.messageId }),
        });
    };

    const removeEmoji = async (emojiId) => {
        await fetch(`http://localhost:5000/api/emoji/removeemoji?emojiId=${emojiId}`, {
            method: "DELETE",
            credentials: "include",
        });
    };

    const handleEmojiClick = async () => {
        const existingEmoji = emoji?.[0] || null;

        if (liked && existingEmoji) {
            await removeEmoji(existingEmoji.emojiId);
            setLiked(false);
        } else {
            await addEmoji("❤️");
            setLiked(true);
        }
    };

    return (
        <div>
            <button onClick={handleEmojiClick} className={st.emojiBtn}>
                <span className={`${st.iconWrapper} ${liked ? st.liked : ""}`}>
                    {liked ? (
                        <LikeIcon />
                    ) : (
                        <FavoriteIcon />
                    )}
                </span>
                {message.emojis?.["❤️"] || 0}
            </button>
        </div>
    );
}

export default Emoji;
