import React, { useEffect, useState } from "react";
import { useMessageForm } from "../messageCard/useMessageForm";
import st from "../messageCard/messageCard.module.css";
import mSt from "./commentCard.module.css";
import { Link } from "react-router-dom";
import { person } from "../../images";
import VideoImageShow from "../messageController/videoImageShow";
import Emoji from "../messageCard/emojis/emoji";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";

function CommentCard({ message, emoji, allEmojis, first, onReply }) {
    const [isItMe, setIsItMe] = useState(true);

    const { user } = useMessageForm(message, true);

    useEffect(() => {
        fetchMethodGet(
            `http://localhost:5000/api/user/isitme/${message.user.id}`
        ).then((res) => setIsItMe(res));
    }, [message.user.id]);

    return (
        <div
            className={mSt.div}
            style={{
                marginLeft: first ? "0px" : "20px",
                borderLeft: first ? "none" : "2px solid #ccc",
                paddingLeft: first ? "0px" : "10px",
            }}
        >
            <div className={mSt.head}>
                <Link to={`/userProfile`} state={isItMe ? null : user}>
                    <div className={st.avDiv}>
                        <img
                            src={
                                user.profileImageUrl === null
                                    ? person
                                    : `http://localhost:5000${user.profileImageUrl}`
                            }
                            alt="person"
                        />
                    </div>
                </Link>
                <div>
                    <p className={st.username}>{user?.userName}</p>
                </div>
                <div className={mSt.like}>
                    <Emoji emoji={emoji} message={message} />
                </div>
            </div>

            <div className={mSt.message}>
                {Array.isArray(message.videoMessagesTo) &&
                    message.videoMessagesTo.length > 0 && (
                        <div
                            style={{
                                width: "auto",
                                height: "300px",
                            }}
                        >
                            <VideoImageShow message={message} />
                        </div>
                    )}
                <div>
                    <p className={st.msgText}>{message.messageText}</p>
                </div>
            </div>

            <button
                onClick={() => onReply && onReply(message)}
                className={mSt.reply}
            >
                Odpovědět
            </button>

            {message.parents &&
                message.parents.map((msg, index) => {
                    const currentEmoji =
                        allEmojis?.filter((e) => e.messageId === msg.messageId) || [];
                    return (
                        <div key={`${msg.messageId}-${index}`} style={{marginTop: '10px'}}>
                            <CommentCard
                                message={msg}
                                emoji={currentEmoji}
                                allEmojis={allEmojis}
                                first={false}
                                onReply={onReply}
                            />
                        </div>
                    );
                })}
        </div>
    );
}

export default CommentCard;
