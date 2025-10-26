import React, { useEffect, useState } from "react";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";
import MessageCard from "../messageCard/messageCard";
import ControlMessages from "../messageController/controlMessages";
import RepeatedBalls from "../globalStyle/repeatedBalls";
import {logo} from "../../images";

function Bookmarks() {
    const [bookmarksWithMessages, setBookmarksWithMessages] = useState([]);

    const {
        messages = [],
        emojis = [],
        users = [],
        bookmarks = [],
        stories = [],
        reposts = [],
        addMessages = [],
        notifications = []
    } = ControlMessages(null);

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
        <div style={{overflow: "hidden"}}>
            <RepeatedBalls/>
            <img src={logo} alt="" style={{margin: "40px"}}/>
            <div style={{display: "flex", flexDirection: "column", gap: "20px", alignItems: "center"}}>
                {bookmarksWithMessages.length === 0 && <p>No bookmarks found.</p>}
                {bookmarksWithMessages.map(bm => (
                    <div key={`${bm.bookmarkId}-${bm.MessageId}`}>
                        <MessageCard
                            message={bm.message}
                            emoji={emojis.filter(e => e.messageId === bm.MessageId)}
                            allEmojis={emojis}
                            bookmarkBool={bookmarks.some(e => e.messageId === bm.MessageId)}
                            repostBool={reposts.some(e => e.messageId === bm.MessageId)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Bookmarks;
