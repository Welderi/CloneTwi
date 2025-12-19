import React, { useRef, useState, useEffect } from "react";
import Emoji from "./emojis/emoji";
import { useMessageForm } from "./useMessageForm";
import VideoImageShow from "../messageController/videoImageShow";
import { Link } from "react-router-dom";
import st from "./messageCard.module.css";
import More from "../more/more";
import {
    person,
    book,
    music,
    comment,
    more,
    picture,
    plane,
} from "../../images";
import CommentCard from "../commentCard/commentCard";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";

function MessageCard({ message, emoji, allEmojis, bookmarkBool, repostBool }) {
    const [arrowDown, setArrowDown] = useState(true);
    const [onReply, setOnReply] = useState(null);
    const [open, setOpen] = useState(false);
    const [isItMe, setIsItMe] = useState(true);

    const prefixRef = useRef(null);
    const [nickOffset, setNickOffset] = useState(15);

    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (prefixRef.current) {
            setNickOffset(prefixRef.current.offsetWidth + 20);
        } else {
            setNickOffset(15);
        }
    }, [onReply]);

    const {
        user,
        messageText,
        videoImage,
        setMessageText,
        inputRef,
        addFile,
        addParentMessage,
    } = useMessageForm(onReply || message, true);

    useEffect(() => {
        fetchMethodGet(
            `http://localhost:5000/api/user/isitme/${message.user.id}`
        ).then((res) => setIsItMe(res));
    }, [message.user.id]);

    const audioRef = useRef(null);

    const changeArrowState = () => {
        setArrowDown((prev) => !prev);
    };

    const messageBtn = (messageReply) => {
        setOnReply(messageReply);
    };

    return (
        <div className={st.div}>
            <div className={st.head}>
                <Link to={`/userProfile`} state={isItMe ? null : user}>
                    <div className={st.avDiv}>
                        <img
                            src={
                                user.profileImageUrl === null
                                    ? person
                                    : `http://localhost:5000${user.profileImageUrl}`
                            }
                            alt="uživatel"
                        />
                    </div>
                </Link>
                <div className={st.textMusic}>
                    <p className={st.username}>{user?.userName}</p>
                    {message.audioMessageTo && (
                        <div>
                            <button onClick={toggleAudio} className={st.musicBtn}>
                                <div className={st.insideBtn}>
                                    <audio
                                        ref={audioRef}
                                        src={`http://localhost:5000${message.audioMessageTo.filePath}`}
                                        preload="auto"
                                        onEnded={() => setIsPlaying(false)}
                                    />
                                    <div style={{ display: "flex", gap: "5px" }}>
                                        <img src={music} alt="hudba" />
                                        <p className={st.musicText}>
                                            {message.audioMessageTo.fileName}
                                        </p>
                                    </div>
                                    <p
                                        style={{
                                            fontSize: "10px",
                                            fontFamily: "Oxygen, sans-serif",
                                            color: "rgba(153, 148, 140, 1)",
                                        }}
                                    >
                                        {isPlaying
                                            ? "Klikni pro vypnutí zvuku"
                                            : "Klikni pro přehrání melodie"}
                                    </p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <button
                        className={st.more}
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <img src={more} alt="více" />
                    </button>
                </div>
            </div>

            <div className={st.msgBody}>
                {Array.isArray(message.videoMessagesTo) &&
                    message.videoMessagesTo.length > 0 && (
                        <div>
                            <VideoImageShow message={message} />
                        </div>
                    )}

                {open && (
                    <div className="dropdownMenu">
                        <More
                            message={message}
                            bookmarkBool={bookmarkBool}
                            repostBool={repostBool}
                            user={user}
                            isItMe={isItMe}
                            onClose={() => setOpen(false)}
                        />
                    </div>
                )}

                <div>
                    <img src={book} alt="text" />
                    <p className={st.msgText}>{message.messageText}</p>
                </div>

                <hr />

                {!arrowDown &&
                    message.parents &&
                    message.parents.map((msg, index) => {
                        const currentEmoji =
                            allEmojis?.filter(
                                (e) => e.messageId === msg.messageId
                            ) || [];
                        return (
                            <div key={`${msg.messageId}-${index}`}>
                                <CommentCard
                                    message={msg}
                                    emoji={currentEmoji}
                                    allEmojis={allEmojis}
                                    first={message.messageParentId === null}
                                    onReply={messageBtn}
                                />
                            </div>
                        );
                    })}

                <div className={st.send}>
                    <Emoji emoji={emoji} message={message} />

                    <button onClick={changeArrowState} className={st.comment}>
                        <img src={comment} alt="komentáře" />
                    </button>

                    <div className={st.inputTextWrapper}>
                        {onReply && (
                            <span ref={prefixRef} className={st.userPrefix}>
                                @{onReply.user.userName}
                            </span>
                        )}
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Backspace" &&
                                    messageText === "" &&
                                    onReply
                                ) {
                                    setOnReply(null);
                                }
                            }}
                            placeholder="Napiš svůj názor"
                            className={st.inputText}
                            style={{
                                paddingLeft: onReply
                                    ? `${nickOffset}px`
                                    : "15px",
                            }}
                        />
                        {(messageText || videoImage) && (
                            <img
                                src={plane}
                                alt="odeslat"
                                onClick={() => {
                                    addParentMessage();
                                    setOnReply(null);
                                }}
                                className={st.plane}
                            />
                        )}
                    </div>

                    <div>
                        <input
                            type="file"
                            onChange={addFile}
                            ref={inputRef}
                            accept="image/*,video/*"
                            multiple
                            style={{ display: "none" }}
                        />
                        <img
                            src={picture}
                            alt="nahrát"
                            onClick={() => inputRef.current.click()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageCard;
