import React, {useState} from "react";
import st from "./firstPage.module.css";
import {logo, sticker} from "../../images";
import Balls from "../animation/animation";
import {useNavigate} from "react-router-dom";
import gSt from "../globalStyle/globalStyle.module.css";

function FirstPage(){
    const [loginText, setLoginText] = useState('Už přemýšlím');
    const [registerText, setRegisterText] = useState('Jsi tu poprvé?');
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
                    <img
                        src={logo}
                        alt="Logo"
                        style={{margin: "40px -20px"}}
                    />
                    <div className={st.mainText}>
                        <h1>Ahoj.</h1>
                        <p>
                            Právě jsi vstoupil do prostoru, kde mají myšlenky
                            <br/>význam.
                        </p>
                        <p>
                            Vytvořili jsme <span className={st.blueText}>Myšlenka</span>, aby každý mohl
                            <br/>svobodně sdílet nápady,
                            novinky, vtipy nebo
                            <br/>něco velmi osobního.
                        </p>
                        <div className={st.stickerDiv}>
                            <img
                                src={sticker}
                                alt="Sticker"
                                className={st.sticker}
                            />
                            <p className={`${st.blueText} ${st.absoluteBlueP}`}>
                                Myšlenka — platforma pro
                                <br/>ty, kteří mají co říct.
                            </p>
                            <p className={st.absoluteP}>A teď…</p>
                        </div>
                    </div>
                </div>

                <div className={`${gSt.rightSide} ${leaving ? gSt.rightSideLeave : ""}`}>
                    <div className={`${st.trWindow} ${gSt.trWindow}`}>
                        <h2>Co si myslíš ty?</h2>

                        <button
                            className={`${st.loginBtn} ${gSt.blueBtn}`}
                            onMouseEnter={() => setLoginText("Přihlásit se")}
                            onMouseLeave={() => setLoginText("Už přemýšlím")}
                            onClick={handleLoginClick}
                        >
                            {loginText}
                        </button>

                        <button
                            className={`${st.registerBtn} ${gSt.trBtn}`}
                            onMouseEnter={() => setRegisterText("Zaregistrovat se")}
                            onMouseLeave={() => setRegisterText("Jsi tu poprvé?")}
                            onClick={handleRegisterClick}
                        >
                            {registerText}
                        </button>
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
