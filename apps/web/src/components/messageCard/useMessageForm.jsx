import {useState, useRef, useEffect} from "react";
import createMessageAsync from "../messageController/createMessage";

export function useMessageForm(message, isParent = true) {
    const [messageText, setMessageText] = useState("");
    const [videoImage, setVideoImage] = useState(null);
    const [user, setUser] = useState(message.user);

    const inputRef = useRef(null);

    useEffect(() => {
        setUser(message.user);
    }, [message.user]);

    const addFile = (e) => {
        setVideoImage(Array.from(e.target.files));
    };

    const addParentMessage = async () => {
        const messageForm = {
            isParent,
            messageText,
            messageParentId: message.messageId,
            videoImage,
        };

        await createMessageAsync(messageForm);
        setMessageText("");
        setVideoImage(null);
    };

    return {
        messageText,
        setMessageText,
        videoImage,
        setVideoImage,
        user,
        inputRef,
        addFile,
        addParentMessage,
    };
}
