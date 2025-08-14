import React, {useState} from "react";
import Emoji from "./emojis/emoji";
import createMessageAsync from "../messageController/createMessage";

function MessageCard({ message, emoji, allEmojis }){
    const [arrowDown, setArrowDown] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [videoImage, setVideoImage] = useState(null);

    const changeArrowState = () => { setArrowDown(prev => !prev); }

    const isVideoFile = (fileName) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', 'mov'];
        return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    };

    const addFile = (e) => {
        setVideoImage(Array.from(e.target.files));
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