import React, { useState, useEffect, useRef } from "react";

function VideoImageShow({ message }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [maxHeight, setMaxHeight] = useState(400);
    const containerRefs = useRef([]);

    const isVideoFile = (fileName) => {
        const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
        return videoExtensions.some((ext) =>
            fileName.toLowerCase().endsWith(ext)
        );
    };

    useEffect(() => {
        if (!Array.isArray(message.videoMessagesTo)) return;

        const heights = containerRefs.current.map((el) =>
            el ? el.offsetHeight : 0
        );
        if (heights.length > 0) {
            setMaxHeight(Math.max(...heights));
        }
    }, [message.videoMessagesTo]);

    if (
        !Array.isArray(message.videoMessagesTo) ||
        message.videoMessagesTo.length === 0
    ) {
        return null;
    }

    const goPrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? message.videoMessagesTo.length - 1 : prev - 1
        );
    };

    const goNext = () => {
        setCurrentIndex((prev) =>
            prev === message.videoMessagesTo.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                // maxWidth: "1000px",
                margin: "0 auto",
            }}
        >
            <div
                style={{
                    display: "flex",
                    transition: "transform 2s ease",
                    transform: `translateX(-${currentIndex * 55}%)`,
                }}
            >
                {message.videoMessagesTo.map((path, index) => {
                    const url = `http://localhost:5000${path.trim?.() || path}`;

                    return (
                        <div
                            key={index}
                            ref={(el) => (containerRefs.current[index] = el)}
                            style={{
                                flex: "0 0 70%",
                                height: `${maxHeight}px`,
                                overflow: "hidden",
                                backgroundColor: "transparent",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "0 5px",
                            }}
                        >
                            {isVideoFile(url) ? (
                                <video
                                    controls
                                    src={url}
                                    onLoadedMetadata={(e) => {
                                        const h = e.target.videoHeight;
                                        if (h > maxHeight) setMaxHeight(h);
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        borderRadius: "16px",
                                    }}
                                />
                            ) : (
                                <img
                                    src={url}
                                    alt="Media"
                                    onLoad={(e) => {
                                        const h = e.target.naturalHeight;
                                        if (h > maxHeight) setMaxHeight(h);
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        borderRadius: "16px",
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {message.videoMessagesTo.length > 1 && (
                <>
                    <div
                        onClick={goPrev}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "60px",
                            background:
                                "linear-gradient(to right, rgba(248, 248, 248, 1), transparent)",
                            cursor: "pointer",
                            zIndex: 2,
                        }}
                    />
                    <div
                        onClick={goNext}
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "60px",
                            background:
                                "linear-gradient(to left, rgba(248, 248, 248, 1), transparent)",
                            cursor: "pointer",
                            zIndex: 2,
                        }}
                    />
                </>
            )}

            <div
                style={{
                    position: "absolute",
                    bottom: "0",
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    gap: "8px",
                    zIndex: 3,
                }}
            >
                {message.videoMessagesTo.map((_, index) => (
                    <span
                        key={index}
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor:
                                index === currentIndex
                                    ? "rgba(62, 116, 183, 1)"
                                    : "rgba(58, 47, 31, 1)",
                            transition: "background-color 0.3s",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default VideoImageShow;
