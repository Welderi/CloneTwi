import React, { useEffect, useState } from "react";
import WebBalls from "./webBalls";

function RepeatedBalls() {
    const [repeatCount, setRepeatCount] = useState(1);

    useEffect(() => {
        const updateRepeats = () => {
            const pageHeight = document.body.scrollHeight;
            const sectionHeight = 200;

            const count = Math.ceil(pageHeight / sectionHeight) + 1;
            setRepeatCount(count);
        };

        updateRepeats();

        return () => {
            window.removeEventListener("resize", updateRepeats);
            window.removeEventListener("scroll", updateRepeats);
        };
    }, []);

    return (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            {Array.from({ length: repeatCount }, (_, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        top: `${i * 800}px`,
                        left: 0,
                        right: 0,
                        height: "800px"
                    }}
                >
                    <WebBalls />
                </div>
            ))}
        </div>
    );
}

export default RepeatedBalls;
