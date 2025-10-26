import React, { useEffect, useState, useRef } from "react";
import st from "./story.module.css";

function StoryViewer({ stories, startIndex, onClose }) {
    const [index, setIndex] = useState(startIndex);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);
    const videoRef = useRef(null);

    const currentStory = stories[index];
    const url = `http://localhost:5000${currentStory.videoMessagesTo?.[0]}`;
    const isVideo = url?.match(/\.(mp4|webm|ogg|mov)$/i);

    const goNext = () => {
        if (index < stories.length - 1) {
            setIndex(index + 1);
        } else {
            onClose();
        }
    };

    const goPrev = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    useEffect(() => {
        clearInterval(timerRef.current);
        setProgress(0);

        if (isVideo) {
            const videoEl = videoRef.current;
            if (videoEl) {
                const updateProgress = () => {
                    setProgress((videoEl.currentTime / videoEl.duration) * 100);
                };
                videoEl.addEventListener("timeupdate", updateProgress);
                videoEl.play();
                videoEl.onended = goNext;

                return () => {
                    videoEl.removeEventListener("timeupdate", updateProgress);
                };
            }
        } else {
            let start = Date.now();
            timerRef.current = setInterval(() => {
                const elapsed = Date.now() - start;
                setProgress((elapsed / 5000) * 100);
                if (elapsed >= 5000) {
                    clearInterval(timerRef.current);
                    goNext();
                }
            }, 100);
        }

        return () => clearInterval(timerRef.current);
    }, [index, isVideo]);

    return (
        <div className={st.viewer}>
            <div className={st.progressBar}>
                {stories.map((_, i) => (
                    <div
                        key={i}
                        className={st.progressSegment}
                        style={{
                            width: `${100 / stories.length}%`,
                            background:
                                i < index
                                    ? "white"
                                    : i === index
                                        ? `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                                        : "rgba(255,255,255,0.3)",
                        }}
                    />
                ))}
            </div>

            <div className={st.content}>
                {isVideo ? (
                    <video
                        ref={videoRef}
                        key={url}
                        src={url}
                        autoPlay
                        controls={false}
                        className={st.media}
                    />
                ) : (
                    <img key={url} src={url} alt="story" className={st.media} />
                )}
            </div>

            <div className={st.leftZone} onClick={goPrev}></div>
            <div className={st.rightZone} onClick={goNext}></div>

            <button className={st.closeBtn} onClick={onClose}>
                ✕
            </button>
        </div>
    );
}

export default StoryViewer;
