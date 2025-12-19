import st from './login.module.css';
import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import Balls from "../animation/animation";
import gSt from '../globalStyle/globalStyle.module.css';
import {logo, openEye, closeEye, google, undo} from '../../images';

function Login(){
    const [usernameEmail, setUsernameEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    UserNameEmail: usernameEmail,
                    Password: password
                })
            });

            const raw = await response.text();

            let result;
            try {
                result = JSON.parse(raw);
            } catch {
                result = raw;
            }

            if (!response.ok) {
                if (typeof result === "string") {
                    setMessage(result);
                } else if (result.errors) {
                    const allMessages = Object.values(result.errors).flat();
                    setMessage(allMessages.join(". "));
                } else {
                    setMessage(result.title || "Došlo k chybě");
                }
            } else {
                navigate("/main");
            }
        } catch (err) {
            console.error(err);
        }
    }

    return(
        <div className={gSt.div}>
            <div className={`${st.mainDiv}`}>
                <img src={logo}
                     alt="Myšlenka Logo"
                     className={gSt.logo}/>
                <h1 className={`${st.h1}`}>Přihlas se a pokračuj jako hlas změny</h1>
                <div className={`${gSt.centerDiv}`}>
                    <div className={`${gSt.trWindow} ${st.trWindow}`}>
                        <input type="text"
                               className={`${gSt.input}`}
                               value={usernameEmail}
                               placeholder={"E-mail / Uživatelské jméno"}
                               onChange={(e) => setUsernameEmail(e.target.value)}/>
                        <div className={`${gSt.password}`}>
                            <input type={showPassword ? "text" : "password"}
                                   className={`${gSt.input}`}
                                   value={password}
                                   placeholder={"Heslo"}
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <span
                                onClick={() => setShowPassword(!showPassword)}>
                                <img
                                    src={showPassword ? closeEye : openEye}
                                    alt="Zobrazení hesla"
                                    className={gSt.eyeImg}
                                />
                            </span>
                        </div>
                        <p className={gSt.error}>{message}</p>
                        <button onClick={login}
                                className={`${gSt.blueBtn} ${st.loginBtn}`}>Přihlásit se</button>
                        {/*<p style={{fontWeight: "bolder",*/ }
                        {/*           fontSize: "14px"}}>nebo</p>*/ }
                        {/*<button*/ }
                        {/*    className={`${gSt.trBtn} ${st.googleBtn}`}*/ }
                        {/*    onClick={() => window.location.href = "http://localhost:5000/api/auth/google-login"}*/ }
                        {/*>*/ }
                        {/*    Google <img src={google} alt="google"/>*/ }
                        {/*</button>*/ }

                    </div>
                    <div className={`${gSt.ballsWrapper} ${st.ballsWrapper}`}>
                        <Balls vertical={true}/>
                    </div>
                </div>
                <Link to={"/"}>
                    <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}>
                        <img src={undo} alt=""/>Myšlenka změněna
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Login;
