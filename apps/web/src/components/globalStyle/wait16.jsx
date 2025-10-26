import React from "react";
import gSt from "./globalStyle.module.css";
import WebBalls from "./webBalls";
import {logo, undo, girl} from "../../images";
import st from "./age.module.css";
import {Link} from "react-router-dom";

function Wait16(){
    return(
        <div className={gSt.div}
             style={{overflow: "hidden",
                 position: "relative"}}>
            <WebBalls/>
            <img src={logo}
                 alt="Dumka Logo"
                 style={{margin: "40px 80px"}}
            />
            <div className={st.main2}>
                <h1>Трохи зачекай 🌱</h1>
                <p style={{
                        marginTop: "-20px",
                        textAlign: "center"
                    }}>
                    Dumka — це простір для тих, кому вже є 16.
                    Але ми впевнені, що час швидко мине, <br/> і ти
                    зможеш приєднатися 😉
                </p>
                <img src={girl}
                     style={{
                         position: "absolute",
                         bottom: "0",
                         right: "3%",
                     }}
                     alt=""/>
            </div>
            <Link to={"/age1"}>
                <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}
                        style={{
                            zIndex: "3",
                            margin: "100px 0px 50px 80px",
                        }}>
                    <img src={undo}
                         alt=""/>Думку змінено
                </button>
            </Link>
        </div>
    );
}

export default Wait16;