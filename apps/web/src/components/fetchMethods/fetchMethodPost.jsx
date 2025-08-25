const fetchMethodPost = async (url, form) => {
    try {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            body: form
        });

        return await res.text();
    } catch (err){
        console.error("Error fetching:", err);
        return null;
    }
};

export default fetchMethodPost;