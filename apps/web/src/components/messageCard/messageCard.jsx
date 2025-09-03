import React, {useRef, useState} from "react";
import Emoji from "./emojis/emoji";
import {useMessageForm} from "./useMessageForm";
import VideoImageShow from "../messageController/videoImageShow";
import {Link} from "react-router-dom";
import st from "./messageCard.module.css";
import More from "../more/more";
import {person, book, music,
        comment, more, picture} from "../../images";
import CommentCard from "../commentCard/commentCard";
import mSt from "../commentCard/commentCard.module.css";

function MessageCard({ message, emoji, allEmojis, bookmarkBool, repostBool}){
    const [arrowDown, setArrowDown] = useState(true);
    const [onReply, setOnReply] = useState(null);
    const [open, setOpen] = useState(false);

    const {
        user,
        messageText,
        videoImage,
        setMessageText,
        inputRef,
        addFile,
        addParentMessage,
    } = useMessageForm(onReply || message, true);

    const audioRef = useRef(null);

    const changeArrowState = () => { setArrowDown(prev => !prev);}

    const messageBtn = (messageReply) => {
        setOnReply(messageReply);
    };

    return(
        <div className={st.div}>
            <div className={st.head}>
                <Link to={`/userProfile`}
                      state={{ user }}>
                    <div className={st.avDiv}>
                        <img src={user.profileImageUrl === null
                                    ? person : `http://localhost:5000${user.profileImageUrl}`}
                             alt="person"
                            />
                    </div>
                </Link>
                <div className={st.textMusic}>
                    <p className={st.username}>{user?.userName}</p>
                    {message.audioMessageTo && (
                        <div>
                            <button onClick={() => audioRef.current?.play()} className={st.musicBtn}>
                                <div className={st.insideBtn}>
                                    <audio
                                        ref={audioRef}
                                        src={`http://localhost:5000${message.audioMessageTo.filePath}`}
                                        preload="auto"
                                    />
                                    <div style={{display: "flex", gap: "5px"}}>
                                        <img src={music}
                                             alt="music"
                                        />
                                        <p className={st.musicText}>{message.audioMessageTo.fileName}</p>
                                    </div>
                                    <p style={{
                                        fontSize: "10px",
                                        fontFamily: "Oxygen, sans-serif",
                                        color: "rgba(153, 148, 140, 1)"
                                    }}>Натисни, щоб почути мелодію</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <button className={st.more}
                            onClick={() => setOpen(prev => !prev)}>
                        <img src={more}
                             alt="more"/>
                    </button>
                </div>
            </div>
            <div className={st.msgBody}>
                {Array.isArray(message.videoMessagesTo) && message.videoMessagesTo.length > 0 && (
                    <div>
                        <VideoImageShow message={message}/>
                    </div>
                )}

                {open && (
                    <div className="dropdownMenu">
                        <More message={message}
                              bookmarkBool={bookmarkBool}
                              repostBool={repostBool}></More>
                    </div>
                )}

                <div>
                    <img src={book}
                         alt="book"/>
                    <p className={st.msgText}>{message.messageText}</p>
                </div>

                <hr/>

                {!arrowDown && message.parents && message.parents.map((msg, index) => {
                    const currentEmoji = allEmojis?.filter(e => e.messageId === msg.messageId) || [];
                    return (
                        <div key={`${msg.messageId}-${index}`}>
                            <CommentCard
                                message={msg}
                                emoji={currentEmoji}
                                allEmojis={allEmojis}
                                first={message.messageParentId === null}
                            />
                            <button onClick={_ => messageBtn(msg)}
                                    className={mSt.reply}>
                                <p>Відповісти</p>
                            </button>
                        </div>
                    );
                })}

                <div className={st.send}>
                    <Emoji emoji={emoji} message={message}/>

                    <button onClick={changeArrowState}
                            className={st.comment}>
                        <img src={comment}
                             alt="comment"/>
                    </button>

                    <p>{onReply?.user?.userName || ""}</p>

                    <input type="text"
                           value={messageText}
                           onChange={(e) => setMessageText(e.target.value)}
                           placeholder={"Залишити свою думку"}
                           className={st.inputText}/>

                    {(messageText || videoImage) && (
                        <button onClick={addParentMessage}>
                            Reply
                        </button>
                    )}

                    <div>
                        <input type="file"
                               onChange={addFile}
                               ref={inputRef}
                               accept="image/*,video/*"
                               multiple
                               style={{display: "none"}}/>
                        <img
                            src={picture}
                            alt="Upload"
                            style={{ cursor: "pointer" }}
                            onClick={() => inputRef.current.click()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageCard;