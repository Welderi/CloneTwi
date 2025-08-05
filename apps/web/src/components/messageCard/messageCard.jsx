import React, {useState, useEffect} from "react";
import Emoji from "./emojis/emoji";

function MessageCard({ message, emojis = [] }){
    const [arrowDown, setArrowDown] = useState(true);
    const [messageText, setMessageText] = useState("");

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

            <Emoji emojis={emojis} message={message}/>
        </div>
    );
}

export default MessageCard;