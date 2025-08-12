import fetchMethodGet from "../fetchMethods/fetchMethodGet";

async function GetMessages(userId) {
    const normalizeParents = (msgs) =>
        msgs.map(msg => ({
            ...msg,
            parents: Array.isArray(msg.parents) ? normalizeParents(msg.parents) : []
        }));

    const url = userId
        ? `http://localhost:5000/api/message/getgroupedmessages/${userId}`
        : `http://localhost:5000/api/message/getgroupedmessages`;

    const data = await fetchMethodGet(url);

    return normalizeParents(data);
}

export default GetMessages;