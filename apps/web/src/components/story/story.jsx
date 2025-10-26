import React, { useState } from "react";
import st from "./story.module.css";
import StoryViewer from "./storyViewer";

function Story({ stories }) {
    const [currentIndex, setCurrentIndex] = useState(null);

    const openViewer = (index) => setCurrentIndex(index);
    const closeViewer = () => setCurrentIndex(null);

    return (
        <div className={st.storyList}>
            {stories.map((story, index) => {
                const url = `http://localhost:5000${story.videoMessagesTo?.[0]}`;
                const isVideo = url?.match(/\.(mp4|webm|ogg|mov)$/i);

                return (
                    <div
                        key={index}
                        className={st.storyPreview}
                        onClick={() => openViewer(index)}
                    >
                        {isVideo ? (
                            <video src={url} muted className={st.previewMedia}></video>
                        ) : (
                            <img src={url} alt="story" className={st.previewMedia} />
                        )}
                    </div>
                );
            })}

            {currentIndex !== null && (
                <StoryViewer
                    stories={stories}
                    startIndex={currentIndex}
                    onClose={closeViewer}
                />
            )}
        </div>
    );
}

export default Story;
