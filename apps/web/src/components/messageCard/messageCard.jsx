import React, {useState} from "react";

function MessageCard({ message }){
    const [arrowDown, setArrowDown] = useState(true);
    const [messageText, setMessageText] = useState("");

    const changeArrowState = () => {
        setArrowDown(prev => !prev);
    }

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

            <button onClick={changeArrowState}>
                {arrowDown ? "↓ Show Replies" : "↑ Hide Replies"}
            </button>

            {!arrowDown && message.parents && message.parents.length > 0 && (
                <div>
                    {message.parents.map(msg => (
                        <MessageCard key={msg.messageId} message={msg}/>
                    ))}
                </div>
            )}

            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
            <button onClick={addParentMessage}>Reply</button>
        </div>
    );
}

export default MessageCard;