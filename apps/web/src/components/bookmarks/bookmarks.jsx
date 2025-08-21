import React, { useEffect, useState } from "react";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";

function Bookmarks() {
    const [bookmarksWithMessages, setBookmarksWithMessages] = useState([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await fetchMethodGet("http://localhost:5000/api/bookmark/getallbookmarks");

                if (!response || !response.bookmarks || !response.messages) {
                    console.warn("Bookmarks API returned empty data");
                    return;
                }

                const bookmarks = response.bookmarks;
                const messages = response.messages;

                const combined = bookmarks.map(b => ({
                    ...b,
                    message: messages.find(m => m.messageId === b.messageId)
                }));

                setBookmarksWithMessages(combined);
            } catch (err) {
                console.error("Error:", err);
            }
        };

        fetchBookmarks();
    }, []);

    return (
        <div>
            <h2>Bookmarks</h2>
            {bookmarksWithMessages.length === 0 && <p>No bookmarks found.</p>}
            {bookmarksWithMessages.map(bm => (
                <div key={`${bm.bookmarkId}-${bm.MessageId}`}>
                    <b>Message Text:</b>{" "}
                    {bm.message?.messageText || ""}
                </div>
            ))}
        </div>
    );
}

export default Bookmarks;
