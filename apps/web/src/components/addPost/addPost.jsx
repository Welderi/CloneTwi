import React, {useState} from "react";

function AddPost(){
    const [messageText, setMessageText] = useState("");
    const [message, setMessage] = useState("");

    const createMessage = async () =>{
        try{
            const response = await fetch("http://localhost:5000/api/message/addmessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    MessageText: messageText
                })
            });

            const result = await response.text();
            setMessage(result);
        }
        catch (err){
            console.error(err);
        }
    };

    return(
        <div>
            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
            <p>{message}</p>
            <button onClick={createMessage}>Create</button>
        </div>
    );
}

export default AddPost;