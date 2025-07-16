import React from "react";

function MessageCard({ message }){
    return(
        <div>
            <h3>Message: </h3>
            <p>{message.messageText}</p>
        </div>
    );
}

export default MessageCard;