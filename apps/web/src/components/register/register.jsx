import st from './register.module.css';
import {useNavigate} from "react-router-dom";
import gSt from "../globalStyle/globalStyle.module.css";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {closeEye, logo, openEye, undo} from "../../images";
import Balls from "../animation/animation";

function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [rules, setRules] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepassword, setShowRepassword] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const register = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userName: username,
                    Email: email,
                    Password: password,
                    ConfirmPassword: repassword
                })
            });

            const registerRaw = await response.text();

            let result;
            try {
                result = JSON.parse(registerRaw);
            } catch {
                result = registerRaw;
            }

            if (!rules) {
                setMessage("Підтвердіть погодження з правилами");
                return;
            }

            if (!response.ok) {
                if (typeof result === "string") {
                    setMessage(result);
                } else if (result.errors) {
                    const allMessages = Object.values(result.errors).flat();
                    setMessage(allMessages.join(". "));
                } else {
                    setMessage(result.title || "Сталася помилка");
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
                     alt="Dumka Logo"
                     draggable={false}
                     className={gSt.logo}/>
                <h1 className={`${st.h1}`}>Зареєструйся, щоб бути частиною спільноти думок</h1>
                <p className={`${st.h1}`}>Нова думка — новий крок</p>
                <div className={`${gSt.centerDiv}`}>
                    <div className={`${gSt.trWindow} ${st.trWindow}`}>
                        <input type="text"
                               className={`${gSt.input}`}
                               placeholder={"Ім'я користувача"}
                               value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <input type="text"
                               className={`${gSt.input}`}
                               placeholder={"Електронна пошта"}
                               value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <div className={`${gSt.password}`}>
                            <input type={showPassword ? "text" : "password"}
                                   className={`${gSt.input}`}
                                   value={password}
                                   placeholder={"Пароль"}
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <span
                                onClick={() => setShowPassword(!showPassword)}>
                                <img
                                    src={showPassword ? closeEye : openEye}
                                    alt="Password visibility"
                                    className={gSt.eyeImg}
                                />
                            </span>
                        </div>
                        <div className={`${gSt.password}`}>
                            <input type={showRepassword ? "text" : "password"}
                                   className={`${gSt.input}`}
                                   value={repassword}
                                   placeholder={"Підтвердження паролю"}
                                   onChange={(e) => setRepassword(e.target.value)}/>
                            <span
                                onClick={() => setShowRepassword(!showRepassword)}>
                                <img
                                    src={showRepassword ? closeEye : openEye}
                                    alt="Password visibility"
                                    className={gSt.eyeImg}
                                />
                            </span>
                        </div>
                        <p className={gSt.error}>{message}</p>
                        <label>
                            <input
                                type="checkbox"
                                checked={rules}
                                onChange={(e) => setRules(e.target.checked)}
                            />
                            Погодження з правилами платформи
                        </label>
                        <button className={`${st.registerBtn} ${gSt.blueBtn}`}
                                onClick={register}>Продовжити</button>
                    </div>
                    <div className={`${gSt.ballsWrapper} ${st.ballsWrapper}`}>
                        <Balls vertical={true}/>
                    </div>
                </div>
                <Link to={"/"}>
                    <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}
                    ><img src={undo} alt=""/>Думку змінено</button>
                </Link>
            </div>
        </div>
    );
}

export default Register;