import React, {useState} from "react";
import {logo, undo} from "../../images";
import st from "./age.module.css";
import {Link} from "react-router-dom";
import gSt from "./globalStyle.module.css";
import WebBalls from "./webBalls";

function Age1(){
    const [temaText, setTemaText] = useState('Я в темі 🔥');
    const [underText, setUnderText] = useState('Ще зарано 🌱');

    return(
        <div className={gSt.div}
             style={{overflow: "hidden",
                     position: "relative"}}>
            <WebBalls/>
            <img src={logo}
                 alt="Dumka Logo"
                 style={{margin: "40px 80px"}}
            />
            <div className={st.main}>
                <h1>Тобі вже є 16?</h1>
                <p style={{margin: "-15px 5px"}}>Ми цінуємо твій досвід і відповідальність</p>

                <div className={st.together}>
                    <div className={st.card}>
                        <h2 className={st.h2}
                            style={{color: "rgba(62, 116, 183, 1)"}}>Чому це важливо:</h2>
                        <p >Dumka створена для вільного простору,
                            де можна ділитися ідеями та думками.
                            Ми хочемо, щоб тобі було комфортно й
                            безпечно, а для цього важливо мати певну зрілість.</p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column",
                                 gap: "40px", alignItems: "center"}}>
                        <Link to={'/helper'}>
                            <button className={`${st.tema} ${gSt.blueBtn}`}
                                    onMouseEnter={() => setTemaText("Так, 16+")}
                                    onMouseLeave={() => setTemaText("Я в темі 🔥")}>
                                {temaText}
                            </button>
                        </Link>
                        <Link to={'/wait16'}>
                            <button className={`${st.wait16} ${gSt.trBtn}`}
                                    onMouseEnter={() => setUnderText("Немає 16")}
                                    onMouseLeave={() => setUnderText("Ще зарано 🌱")}>
                                {underText}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <Link to={"/register"}>
                <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}
                        style={{
                            margin: "100px 0px 50px 80px",
                            zIndex: "3"
                        }}>
                    <img src={undo}
                         alt=""/>Думку змінено
                </button>
            </Link>
        </div>
    );
}

export default Age1;