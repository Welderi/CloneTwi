import React, {useState} from "react";
import st from "./firstPage.module.css";
import {logo, sticker} from "../../images";
import Balls from "../animation/animation";

function FirstPage(){
    const [loginText, setLoginText] = useState('Я вже думаю');
    const [registerText, setRegisterText] = useState('Вперше тут?');

    return(
            <div className={st.div}>
                <div className={st.mainDiv}>
                    <div>
                        <img src={logo}
                             alt="Dumka Logo"
                             draggable={false}
                             className={st.logo}/>
                        <div className={st.mainText}>
                            <h1>Привіт.</h1>
                            <p>Ти щойно зайшов у простір, де думки мають <br/> значення.</p>
                            <p>
                                Ми створили <span className={st.blueText}>Dumka</span>, щоб кожен міг вільно <br/> ділитися ідеями,
                                новинами, жартами чи <br/> чимось дуже особистим.
                            </p>
                            <div className={st.stickerDiv}>
                                <img src={sticker} alt="Sticker" draggable={false} className={st.sticker}/>
                                <p className={`${st.blueText} ${st.absoluteBlueP}`}>Dumka — платформа для <br/> тих, хто має що сказати.</p>
                                <p className={st.absoluteP}>А тепер...</p>
                        </div>
                        </div>
                    </div>
                    <div className={st.balls}>
                        <div className={st.trWindow}>
                            <h2>Що думаєш ти?</h2>
                            <button className={st.loginBtn}
                                    onMouseEnter={() => setLoginText("Увійти")}
                                    onMouseLeave={() => setLoginText("Я вже думаю")}>{loginText}</button>
                            <button className={st.registerBtn}
                                    onMouseEnter={() => setRegisterText("Зареєструватися")}
                                    onMouseLeave={() => setRegisterText("Вперше тут?")}>{registerText}</button>
                        </div>
                        <div className={st.ballsWrapper}>
                            <Balls />
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default FirstPage;