const fetchMethodGet = async (url) => {
    try {
        const res = await fetch(url, {credentials: "include"});
        return await res.json();
    } catch (err){
        console.error("Error fetching:", err);
        return null;
    }
};

export default fetchMethodGet;