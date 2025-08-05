import React, {useEffect, useState} from "react";

function Emoji ({emojis = [], message}) {
    const [userEmoji, setUserEmoji] = useState(null);

    const typesEmojis = ["❤️","👍","😂","😭"];

    useEffect(() => {
        if (emojis.length > 0) {
            setUserEmoji(emojis[0]);
        } else {
            setUserEmoji(null);
        }
    }, [emojis]);

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

export default Emoji;
