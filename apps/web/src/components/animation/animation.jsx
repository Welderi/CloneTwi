import React, {useEffect} from "react";
import st from "./animation.module.css";
import {grayBall, brownBall, whiteBall} from "../../images";

const BALLS = [grayBall, brownBall, whiteBall];

const generateTriangle = (CONTAINER_WIDTH, CONTAINER_HEIGHT) => {
    const randPoint = () => ({
        x: CONTAINER_WIDTH > CONTAINER_HEIGHT
            ? Math.random() * (CONTAINER_WIDTH - 200) + 50
            : Math.random() * (CONTAINER_WIDTH - 150) + 100,
        y: CONTAINER_WIDTH > CONTAINER_HEIGHT
            ? Math.random() * (CONTAINER_HEIGHT - 150) + 100
            : Math.random() * (CONTAINER_HEIGHT - 200) + 50,
    });

    const p1 = randPoint();
    const p2 = randPoint();
    const p3 = randPoint();

    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    if (dist(p1, p2) < 100 || dist(p1, p3) < 100 || dist(p2, p3) < 100) {
        return generateTriangle(CONTAINER_WIDTH, CONTAINER_HEIGHT);
    }

    return [p1, p2, p3];
};

const shuffled = [...BALLS].sort(() => Math.random() - 0.5);

const Balls = React.memo(function Balls({vertical = false}) {
    const CONTAINER_WIDTH = vertical ? 1200 : 800;
    const CONTAINER_HEIGHT = vertical ? 600 : 1000;

    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelectorAll(`.${st.orb}`).forEach(el => {
                el.style.animationPlayState = "running";
            });
        }, 50);
        return () => clearTimeout(timer);
    }, []);


    return (
        <div>
            <div className={st.orbsContainer}>
                {Array.from({ length: 7 }).map((_, i) => {
                    const ball = shuffled[i % BALLS.length];
                    const size = `${100 + Math.random() * 150}px`;
                    const triangle = generateTriangle(CONTAINER_WIDTH, CONTAINER_HEIGHT);
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
                                animationPlayState: "paused",
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
