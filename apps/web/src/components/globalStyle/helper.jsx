import React from "react";
import gSt from "./globalStyle.module.css";
import WebBalls from "./webBalls";
import {girl2, logo, undo} from "../../images";
import st from "./age.module.css";
import {Link} from "react-router-dom";

function Helper(){
    return(
        <div className={gSt.div}
             style={{overflow: "hidden",
                 position: "relative"}}>
            <WebBalls/>
            <img src={logo}
                 alt="Dumka Logo"
                 style={{margin: "40px 80px"}}
            />
            <img src={girl2}
                 style={{
                     position: "absolute",
                     bottom: "0",
                     right: "300px",
                     height: "600px"
                 }}
                 alt=""/>
            <div className={st.main}>
                <h1>Tvůj současný asistent — Varyana</h1>
                <p style={{margin: "-15px 5px"}}>Pomůže ti s prací v našem
                    servisu a vše trochu zpříjemní 🌟</p>

                <div className={st.together}
                     style={{
                         marginTop: "150px"
                     }}>
                    <div>
                        <ul style={{
                            fontSize: "23px"
                        }}>
                            <li>Přátelská, klidná, pozorná k detailům</li>
                            <li>Vždy připravena poradit nebo <br/> podpořit</li>
                            <li>Má lehký smysl pro humor, aby <br/> uvolnila atmosféru</li>
                        </ul>
                        <Link to={'/interests'}>
                            <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}
                                    style={{
                                        width: "150px",
                                        height: "40px"
                                    }}>
                                Dále
                            </button>
                        </Link>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
            <Link to={"/age1"}>
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

export default Helper;
