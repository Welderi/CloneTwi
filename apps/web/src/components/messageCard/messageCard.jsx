import React, {useEffect, useRef, useState} from "react";
import Emoji from "./emojis/emoji";
import createMessageAsync from "../messageController/createMessage";
import VideoImageShow from "../messageController/videoImageShow";
import fetchMethodPost from "../fetchMethods/fetchMethodPost";

function MessageCard({ message, emoji, allEmojis, bookmarkBool, repostBool}){
    const [arrowDown, setArrowDown] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [videoImage, setVideoImage] = useState(null);
    const [bookmark, setBookmark] = useState(bookmarkBool);
    const [repost, setRepost] = useState(repostBool);
    const audioRef = useRef(null);

    const changeArrowState = () => { setArrowDown(prev => !prev); }

    useEffect(() => {
        setBookmark(bookmarkBool);
        setRepost(repostBool);
    }, [bookmarkBool, repostBool]);

    const addFile = (e) => {
        setVideoImage(Array.from(e.target.files));
    };

    const addBookmark = async () => {
        const form = new FormData();
        form.append("MessageId", message.messageId);

        const res = await fetchMethodPost("http://localhost:5000/api/bookmark/addbookmark", form);

        console.log(res);
    };

    const addRepost = async () => {
        const form = new FormData();
        form.append("MessageId", message.messageId);

        const res = await fetchMethodPost("http://localhost:5000/api/repost/addrepost", form);

        console.log(res);
    };

    const removeBookmark = async (messageId) => {
        const res = await fetch(`http://localhost:5000/api/bookmark/removebookmark/${messageId}`,{
            method: "DELETE",
            credentials: "include",
        })

        console.log(res);
    };

    const removeRepost = async (messageId) => {
        const res = await fetch(`http://localhost:5000/api/repost/removerepost/${messageId}`,{
            method: "DELETE",
            credentials: "include",
        })

        console.log(res);
    };

    const addParentMessage = async () =>{
        const messageForm = {
            isParent: true,
            messageText: messageText,
            messageParentId: message.messageId,
            videoImage: videoImage
        };

        await createMessageAsync(messageForm);
        setMessageText("");
        setVideoImage(null);
    }

    return(
        <div>

            <h3>Message: </h3>

            {message.audioMessageTo && (
                <div>
                    <audio
                        ref={audioRef}
                        src={`http://localhost:5000${message.audioMessageTo}`}
                        preload="auto"
                    />
                    <button onClick={() => audioRef.current?.play()}>Play audio</button>
                </div>
            )}

            <p>{message.messageText}</p>

            {Array.isArray(message.videoMessagesTo) && message.videoMessagesTo.length > 0 && (
                <div>
                    <VideoImageShow message={message}/>
                </div>
            )}


            <button onClick={changeArrowState}>
                {arrowDown ? "↓ Show Replies" : "↑ Hide Replies"}
            </button>

            {!arrowDown && message.parents && message.parents.map((msg, index) => {
                const currentEmoji = allEmojis?.filter(e => e.messageId === msg.messageId) || [];
                return (
                    <MessageCard
                        key={`${msg.messageId}-${index}`}
                        message={msg}
                        emoji={currentEmoji}
                        allEmojis={allEmojis}
                    />
                );
            })}

            Bookmark <input
                type="checkbox"
                checked={bookmark}
                onChange={async (e) => {
                    if (e.target.checked) {
                        await addBookmark();
                        setBookmark(true);
                    } else {
                        await removeBookmark(message.messageId);
                        setBookmark(false);
                    }
                }}
            />

            | Repost <input
                type="checkbox"
                checked={repost}
                onChange={async (e) => {
                    if (e.target.checked) {
                        await addRepost();
                        setRepost(true);
                    } else {
                        await removeRepost(message.messageId);
                        setRepost(false);
                    }
                }}
            />

            <p>Themes: </p>

            {message.themes && message.themes.map((theme, index) => {
                return(
                    <div key={index}>
                        <p key={index}># {theme}</p>
                    </div>
                );
            })}

            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
            <input type="file" onChange={addFile} accept="image/*,video/*" multiple />
            <button onClick={addParentMessage}>Reply</button>

            <Emoji emoji={emoji} message={message}/>
        </div>
    );
}

export default MessageCard;