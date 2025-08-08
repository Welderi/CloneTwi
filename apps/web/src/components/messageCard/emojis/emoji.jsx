import React from "react";

function Emoji ({emoji, message}) {
    const typesEmojis = ["❤️","👍","😂","😭"];

    const addEmoji = async (emojiType) => {
        try {
            await fetch("http://localhost:5000/api/emoji/addemoji", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ EmojiType: emojiType, MessageId: message.messageId }),
            });
        } catch (err) {
            console.error(err);
        }
    };

    const removeEmoji = async (emojiId) => {
        try {
            await fetch(`http://localhost:5000/api/emoji/removeemoji?emojiId=${emojiId}`, {
                method: "DELETE",
                credentials: "include",
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmojiClick = async (emojiType) => {
        const existingEmoji = emoji?.[0] || null;

        if (existingEmoji) {
            if (existingEmoji.emojiType === emojiType) {
                await removeEmoji(existingEmoji.emojiId);
            } else {
                await removeEmoji(existingEmoji.emojiId);
                await addEmoji(emojiType);
            }
        } else {
            await addEmoji(emojiType);
        }
    };



    return (
        <div>
            {typesEmojis.map((em, index) => (
                <button
                    key={index}
                    onClick={() => handleEmojiClick(em)}
                    style={{
                        background: emoji?.some(e => e.emojiType === em) ? "red" : "white",
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


export default Emoji;
