import React from "react";

function VideoImageShow({ message }) {
    const isVideoFile = (fileName) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    };

    if (!Array.isArray(message.videoMessagesTo)) return null;

    return (
        <div>
            {message.videoMessagesTo.map((mediaPath, index) => {
                const url = `http://localhost:5000${mediaPath.trim?.() || mediaPath}`;

                if (isVideoFile(url)) {
                    return (
                        <video
                            key={index}
                            width="320"
                            height="240"
                            controls
                            src={url}
                            style={{ margin: "5px", borderRadius: "8px" }}
                        />
                    );
                } else {
                    return (
                        <img
                            key={index}
                            src={url}
                            alt="Media"
                            style={{
                                maxWidth: "200px",
                                borderRadius: "8px",
                                margin: "5px",
                            }}
                        />
                    );
                }
            })}
        </div>
    );
}

export default VideoImageShow;