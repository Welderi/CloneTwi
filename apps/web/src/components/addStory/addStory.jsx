import React, {useState} from "react";
import createMessageAsync from "../messageController/createMessage";

function AddStory(){
    const [videoImage, setVideoImage] = useState(null);

    const createMessage = async () =>{
        const messageForm = {
            isParent: false,
            messageParentId: null,
            videoImage: videoImage,
            isStory: true,
        };

        console.log(await createMessageAsync(messageForm));
    };

    return(
        <div>
            <input type="file"
                   onChange={e => setVideoImage(e.target.files[0])}
                   accept="image/*,video/*" />

            <button onClick={createMessage}>Create</button>
        </div>
    );
}

export default AddStory;