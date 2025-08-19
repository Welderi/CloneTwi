import React, {useState} from "react";
import st from "./animation.module.css";
import {grayBall, brownBall, whiteBall} from "../../images";

const BALLS = [
    grayBall,
    brownBall,
    whiteBall
];

const CONTAINER_WIDTH = 800;
const CONTAINER_HEIGHT = 1000;

const generateTriangle = () => {
    const randPoint = () => ({
        x: Math.random() * (CONTAINER_WIDTH - 150) + 100,
        y: Math.random() * (CONTAINER_HEIGHT - 200) + 50,
    });

    const p1 = randPoint();
    const p2 = randPoint();
    const p3 = randPoint();

    const dist = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

    if (dist(p1, p2) < 100 || dist(p1, p3) < 100 || dist(p2, p3) < 100) {
        return generateTriangle();
    }

    return [p1, p2, p3];
};

const shuffled = [...BALLS].sort(() => Math.random() - 0.5);

const Balls = React.memo(function Balls() {
    return(
        <div>
            <div className={st.orbsContainer}>
                {Array.from({ length: 7 }).map((_, i) => {
                    const ball = shuffled[i % BALLS.length];
                    const size = `${100 + Math.random() * 150}px`;
                    const triangle = generateTriangle();

                    const startVertex = Math.floor(Math.random() * 3);
                    const delay = startVertex * 3;

                    return (
                        <img
                            src={ball}
                            key={i}
                            className={st.orb}
                            draggable={false}
                            style={{
                                width: size,
                                height: size,
                                "--x1": `${triangle[0].x}px`,
                                "--y1": `${triangle[0].y}px`,
                                "--x2": `${triangle[1].x}px`,
                                "--y2": `${triangle[1].y}px`,
                                "--x3": `${triangle[2].x}px`,
                                "--y3": `${triangle[2].y}px`,
                                animationDuration: "15s",
                                animationDelay: `-${delay * 5}s`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default Balls;