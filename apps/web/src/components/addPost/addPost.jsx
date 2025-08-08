import React, {useState} from "react";
import createMessageAsync from "../messageController/createMessage";

function AddPost(){
    const [messageText, setMessageText] = useState("");
    const [message, setMessage] = useState("");
    const [videoImage, setVideoImage] = useState(null);

    const addFile = (e) => {
        setVideoImage(Array.from(e.target.files));
    };

    const createMessage = async () =>{
        const messageForm = {
            isParent: false,
            messageText: messageText,
            messageParentId: null,
            videoImage: videoImage
        };

        const result = await createMessageAsync(messageForm);
        setMessage(result);
    };

    return(
        <div>
            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
            <input type="file" onChange={addFile} accept="image/*,video/*" multiple />
            <p>{message}</p>
            <button onClick={createMessage}>Create</button>
        </div>
    );
}

export default AddPost;