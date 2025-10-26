import React from "react";
import { brownBall, whiteBall, grayBall } from "../../images";

function WebBalls() {
    const balls = [
        {
            src: brownBall,
            style: { top: "5%", right: "15%", width: "120px", zIndex: 2 }
        },
        {
            src: whiteBall,
            style: { top: "-10%", right: "-10%", width: "400px", zIndex: 1 }
        },
        {
            src: brownBall,
            style: { bottom: "20%", left: "-10%", width: "300px", zIndex: 1 }
        },
        {
            src: whiteBall,
            style: { bottom: "15%", left: "10%", width: "180px", zIndex: 2 }
        },
        {
            src: whiteBall,
            style: { bottom: "-15%", right: "-15%", width: "380px", zIndex: 1 }
        },
        {
            src: grayBall,
            style: { bottom: "25%", right: "-8%", width: "200px", zIndex: 2 }
        }
    ];

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 0
            }}
        >
            {balls.map((ball, i) => (
                <img
                    key={i}
                    src={ball.src}
                    alt=""
                    style={{
                        position: "absolute",
                        ...ball.style
                    }}
                />
            ))}
        </div>
    );
}

export default WebBalls;
