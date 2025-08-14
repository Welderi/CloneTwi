// message = {isParent, messageText, messageParentId, videoImage}

const createMessageAsync = async (message) => {
    try{
        const form = new FormData();
        form.append("MessageText", message.messageText);

        if(message.messageParentId){
            form.append("MessageParentId", message.messageParentId)
        }

        if(message.videoImage){
            for (let i = 0; i < message.videoImage.length; i++) {
                form.append("VideoMessages", message.videoImage[i]);
            }
        }

        if(message.themes){
            for (let i = 0; i < message.themes.length; i++) {
                form.append("Themes", message.themes[i]);
            }
        }

        const url = "http://localhost:5000/api/message/addmessage/" + (message.isParent ? "true" : "false");

        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            body: form,
        });

        const result = await response.text();
        return result;
    }
    catch (err){
        console.error(err);
    }
}

export default createMessageAsync;