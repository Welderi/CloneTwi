import React, {useState} from "react";

function AddPost(){
    const [messageText, setMessageText] = useState("");
    const [message, setMessage] = useState("");
    const [videoImage, setVideoImage] = useState(null);

    const addFile = (e) => {
        setVideoImage(Array.from(e.target.files));
    };

    const createMessage = async () =>{
        try{
            const form = new FormData();
            form.append("MessageText", messageText);

            if(videoImage){
                for (let i = 0; i < videoImage.length; i++) {
                    form.append("VideoMessages", videoImage[i]);
                }
            }

            const response = await fetch("http://localhost:5000/api/message/addmessage", {
                method: "POST",
                credentials: "include",
                body: form,
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
            <input type="file" onChange={addFile} accept="image/*,video/*" multiple />
            <p>{message}</p>
            <button onClick={createMessage}>Create</button>
        </div>
    );
}

export default AddPost;