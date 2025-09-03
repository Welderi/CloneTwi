import React, {useState} from "react";
import {useMessageForm} from "../messageCard/useMessageForm";
import st from "../messageCard/messageCard.module.css";
import mSt from "./commentCard.module.css";
import {Link} from "react-router-dom";
import {person, picture} from "../../images";
import VideoImageShow from "../messageController/videoImageShow";
import Emoji from "../messageCard/emojis/emoji";

function CommentCard({message, emoji, allEmojis, first}){
    const {
        user,
        messageText,
        setMessageText,
        inputRef,
        addFile,
        addParentMessage,
    } = useMessageForm(message, true);

    return(
        <div className={mSt.div}>
            <div className={mSt.head}>
                <p>{first}</p>
                <Link to={`/userProfile/${user?.id}`}>
                    <div className={st.avDiv}>
                        <img src={user.profileImageUrl === null
                            ? person : user.profileImageUrl}
                             alt="person"/>
                    </div>
                </Link>
                <div>
                    <p className={st.username}>{user?.userName}</p>
                </div>
                <div className={mSt.like}>
                    <Emoji emoji={emoji}
                           message={message}/>
                </div>
            </div>
            <div className={mSt.message}>
                {Array.isArray(message.videoMessagesTo) && message.videoMessagesTo.length > 0 && (
                    <div className={mSt.commentVideo}>
                        <VideoImageShow message={message}/>
                    </div>
                )}
                <div>
                    <p className={st.msgText}>{message.messageText}</p>
                </div>
            </div>

            {message.parents && message.parents.map((msg, index) => {
                const currentEmoji = allEmojis?.filter(e => e.messageId === msg.messageId) || [];
                return (
                    <div key={`${msg.messageId}-${index}`}>
                        <hr/>
                        <CommentCard
                            message={msg}
                            emoji={currentEmoji}
                            allEmojis={allEmojis}
                            first={message.messageParentId === null}
                        />
                        {/*<button onClick={_ => messageBtn(msg)}*/}
                        {/*        className={mSt.reply}>*/}
                        {/*    <p>Відповісти</p>*/}
                        {/*</button>*/}
                    </div>
                );
            })}
        </div>
    );
}

export default CommentCard;