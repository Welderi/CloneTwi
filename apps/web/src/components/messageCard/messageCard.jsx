import React, {useState, useEffect} from "react";

function MessageCard({ message, emojis = [] }){
    const [arrowDown, setArrowDown] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [userEmoji, setUserEmoji] = useState(null);

    const typesEmojis = ["❤️","👍","😂","😭"];

    useEffect(() => {
        if (emojis.length > 0) {
            setUserEmoji(emojis[0]);
        } else {
            setUserEmoji(null);
        }
    }, [emojis]);

    const changeArrowState = () => {
        setArrowDown(prev => !prev);
    }

    const isVideoFile = (fileName) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', 'mov'];
        return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    };

    const addParentMessage = async () =>{
        try {
            await fetch("http://localhost:5000/api/message/addparentmessage", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    MessageText: messageText,
                    MessageParentId: message.messageId
                })
            });
            setMessageText("");
        }
        catch (err){
            console.error(err);
        }
    }

    const addEmoji = async (emojiType) => {
        try {
            const res = await fetch("http://localhost:5000/api/emoji/addemoji", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    EmojiType: emojiType,
                    MessageId: message.messageId,
                }),
            });

            const data = await res.json();
            setUserEmoji({
                emojiType: data.emojiType,
                emojiId: data.emojiId,
                messageId: data.messageId,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const removeEmoji = async (emojiId) => {
        console.log(emojiId);
        try {
            await fetch(`http://localhost:5000/api/emoji/removeemoji?emojiId=${emojiId}`, {
                method: "DELETE",
                credentials: "include",
            });

            setUserEmoji(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmojiClick = async (emojiType) => {
        if (userEmoji?.emojiType === emojiType) {
            await removeEmoji(userEmoji.emojiId);
        } else {
            if (userEmoji?.emojiId) {
                await removeEmoji(userEmoji.emojiId);
            }
            await addEmoji(emojiType);
        }
    };

    return(
        <div>
            <h3>Message: </h3>
            <p>{message.messageText}</p>

            {Array.isArray(message.videoMessagesTo) && message.videoMessagesTo.length > 0 && (
                <div>
                    {message.videoMessagesTo.map((mediaPath, index) => {
                        const url = `http://localhost:5000${mediaPath.trim?.() || mediaPath}`;

                        if (isVideoFile(url)) {
                            return (
                                <video
                                    key={index}
                                    width="320"
                                    height="240"
                                    controls
                                    src={url}
                                    style={{ margin: '5px', borderRadius: '8px' }}
                                />
                            );
                        } else {
                            return (
                                <img
                                    key={index}
                                    src={url}
                                    alt="Media"
                                    style={{ maxWidth: "200px", borderRadius: "8px", margin: "5px" }}
                                />
                            );
                        }
                    })}
                </div>
            )}


            <button onClick={changeArrowState}>
                {arrowDown ? "↓ Show Replies" : "↑ Hide Replies"}
            </button>

            {!arrowDown && message.parents && message.parents.map((msg, index) => (
                <MessageCard key={`${msg.messageId}-${index}`} message={msg} />
            ))}

            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
            <button onClick={addParentMessage}>Reply</button>

            {typesEmojis.map((em, index) => (
                <button
                    key={index}
                    onClick={() => handleEmojiClick(em)}
                    style={{
                        background: userEmoji?.emojiType === em ? "red" : "white",
                        margin: "4px",
                        borderRadius: "6px",
                    }}
                >
                    {em} : {message.emojis?.[em] || 0}
                </button>
            ))}
        </div>
    );
}

export default MessageCard;