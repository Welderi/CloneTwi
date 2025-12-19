import React, {useState} from "react";
import {logo, undo} from "../../images";
import st from "./age.module.css";
import {Link} from "react-router-dom";
import gSt from "./globalStyle.module.css";
import WebBalls from "./webBalls";

function Age1(){
    const [temaText, setTemaText] = useState('Jsem v tématu 🔥');
    const [underText, setUnderText] = useState('Ještě brzo 🌱');

    return(
        <div className={gSt.div}
             style={{overflow: "hidden",
                 position: "relative"}}>
            <WebBalls/>
            <img src={logo}
                 alt="Logo"
                 style={{margin: "40px 80px"}}
            />
            <div className={st.main}>
                <h1>Už ti je 16?</h1>
                <p style={{margin: "-15px 5px"}}>Ceníme si tvých zkušeností a odpovědnosti</p>

                <div className={st.together}>
                    <div className={st.card}>
                        <h2 className={st.h2}
                            style={{color: "rgba(62, 116, 183, 1)"}}>Proč je to důležité:</h2>
                        <p>Dumka je vytvořena jako volný prostor,
                            kde se můžeš dělit o nápady a myšlenky.
                            Chceme, aby ses cítil/a pohodlně a
                            bezpečně, a proto je důležité mít určitou zralost.</p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column",
                        gap: "40px", alignItems: "center"}}>
                        <Link to={'/helper'}>
                            <button className={`${st.tema} ${gSt.blueBtn}`}
                                    onMouseEnter={() => setTemaText("Ano, 16+")}
                                    onMouseLeave={() => setTemaText("Jsem v tématu🔥")}>
                                {temaText}
                            </button>
                        </Link>
                        <Link to={'/wait16'}>
                            <button className={`${st.wait16} ${gSt.trBtn}`}
                                    onMouseEnter={() => setUnderText("Není 16")}
                                    onMouseLeave={() => setUnderText("Ještě brzo 🌱")}>
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
                         alt=""/>Myšlenka změněna
                </button>
            </Link>
        </div>
    );
}

export default Age1;
