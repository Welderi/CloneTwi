import React, {useState} from "react";
import st from "./firstPage.module.css";
import {logo, sticker} from "../../images";
import Balls from "../animation/animation";
import {useNavigate} from "react-router-dom";
import gSt from "../globalStyle/globalStyle.module.css";

function FirstPage(){
    const [loginText, setLoginText] = useState('Я вже думаю');
    const [registerText, setRegisterText] = useState('Вперше тут?');
    const navigate = useNavigate();
    const [leaving, setLeaving] = useState(false);

    const handleLoginClick= () => {
        setLeaving(true);
        setTimeout(() => navigate('/login'), 500);
    };

    const handleRegisterClick = () => {
        setLeaving(true);
        setTimeout(() => navigate('/register'), 500);
    };

    return(
            <div className={gSt.div}>
                <div className={`${st.mainDiv} ${gSt.mainDiv}`}>
                    <div className={`${gSt.leftSide} ${leaving ? gSt.leftSideLeave : ""}`}>
                        <img src={logo}
                             alt="Dumka Logo"
                             className={gSt.logo}/>
                        <div className={st.mainText}>
                            <h1>Привіт.</h1>
                            <p>Ти щойно зайшов у простір, де думки мають <br/> значення.</p>
                            <p>
                                Ми створили <span className={st.blueText}>Dumka</span>, щоб кожен міг вільно <br/> ділитися ідеями,
                                новинами, жартами чи <br/> чимось дуже особистим.
                            </p>
                            <div className={st.stickerDiv}>
                                <img src={sticker} alt="Sticker" className={st.sticker}/>
                                <p className={`${st.blueText} ${st.absoluteBlueP}`}>Dumka — платформа для <br/> тих, хто має що сказати.</p>
                                <p className={st.absoluteP}>А тепер...</p>
                        </div>
                        </div>
                    </div>
                    <div className={`${gSt.rightSide} ${leaving ? gSt.rightSideLeave : ""}`}>
                        <div className={`${st.trWindow} ${gSt.trWindow}`}>
                            <h2>Що думаєш ти?</h2>
                            <button className={`${st.loginBtn} ${gSt.blueBtn}`}
                                    onMouseEnter={() => setLoginText("Увійти")}
                                    onMouseLeave={() => setLoginText("Я вже думаю")}
                                    onClick={handleLoginClick}>{loginText}</button>
                            <button className={`${st.registerBtn} ${gSt.trBtn}`}
                                    onMouseEnter={() => setRegisterText("Зареєструватися")}
                                    onMouseLeave={() => setRegisterText("Вперше тут?")}
                                    onClick={handleRegisterClick}>{registerText}</button>
                        </div>
                        <div className={`${st.ballsWrapper} ${gSt.ballsWrapper}`}>
                            <Balls vertical={false}/>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default FirstPage;