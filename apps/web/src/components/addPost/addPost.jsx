import React, {useEffect, useState} from "react";
import createMessageAsync from "../messageController/createMessage";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";
import CreatableSelect from "react-select/creatable";

const THEMES = ["Creative", "History", "Science", "Hobby", "General"]

function AddPost(){
    const [messageText, setMessageText] = useState("");
    const [message, setMessage] = useState("");
    const [videoImage, setVideoImage] = useState(null);
    const [allThemes, setAllThemes] = useState(THEMES);
    const [selectedThemes, setSelectedThemes] = useState([]);

    const addFile = (e) => {
        setVideoImage(Array.from(e.target.files));
    };

    const createMessage = async () =>{
        const messageForm = {
            isParent: false,
            messageText: messageText,
            messageParentId: null,
            videoImage: videoImage,
            themes: selectedThemes.map(t => t.value)
        };

        const result = await createMessageAsync(messageForm);
        setMessage(result);
    };

    useEffect(() => {
        const getAllThemes = async () => {
            const data = await fetchMethodGet("http://localhost:5000/api/theme/getallthemes");

            setAllThemes(prev => [...new Set([...prev, ...data])]);
        };

        getAllThemes();
    }, []);

    const themeOptions = allThemes.map(t => ({ value: t, label: t }));

    return(
        <div>
            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
            <input type="file" onChange={addFile} accept="image/*,video/*" multiple />
            <span>Theme</span>

            <CreatableSelect
                isMulti
                options={themeOptions}
                value={selectedThemes}
                onChange={setSelectedThemes}
                placeholder="Choose or create"
                noOptionsMessage={() => "Nothing here"}
            />

            <p>{message}</p>
            <button onClick={createMessage}>Create</button>
        </div>
    );
}

export default AddPost;