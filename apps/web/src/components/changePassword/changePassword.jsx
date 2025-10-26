import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import st from '../login/login.module.css';
import gSt from '../globalStyle/globalStyle.module.css';
import { logo, openEye, closeEye, undo } from '../../images';
import Balls from "../animation/animation";

function ChangePassword() {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const navigate = useNavigate();

    const changePassword = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/changepassword", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    CurrentPassword: password,
                    NewPassword: newPassword
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
                setMessage(typeof result === "string" ? result : result.title || "Сталася помилка");
            } else {
                setMessage("Пароль успішно змінено!");
                setPassword("");
                setNewPassword("");
            }
        } catch (err) {
            console.error(err);
            setMessage("Сталася помилка при зміні паролю");
        }
    }

    return (
        <div className={gSt.div}>
            <div className={`${st.mainDiv}`}>
                <img src={logo} alt="Dumka Logo" className={gSt.logo}/>
                <h1 className={`${st.h1}`}>Змініть свій пароль</h1>
                <div className={`${gSt.centerDiv}`} style={{marginBottom: "50px"}}>
                    <div className={`${gSt.trWindow} ${st.trWindow}`}>
                        <div className={`${gSt.password}`}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`${gSt.input}`}
                                value={password}
                                placeholder={"Поточний пароль"}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span onClick={() => setShowPassword(!showPassword)}>
                                <img
                                    src={showPassword ? closeEye : openEye}
                                    alt="Toggle password"
                                    className={gSt.eyeImg}
                                />
                            </span>
                        </div>
                        <div className={`${gSt.password}`}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className={`${gSt.input}`}
                                value={newPassword}
                                placeholder={"Новий пароль"}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span onClick={() => setShowNewPassword(!showNewPassword)}>
                                <img
                                    src={showNewPassword ? closeEye : openEye}
                                    alt="Toggle new password"
                                    className={gSt.eyeImg}
                                />
                            </span>
                        </div>
                        <p className={gSt.error}>{message}</p>
                        <button
                            onClick={changePassword}
                            className={`${gSt.blueBtn} ${st.loginBtn}`}
                        >
                            Змінити пароль
                        </button>
                    </div>
                    <div className={`${gSt.ballsWrapper} ${st.ballsWrapper}`}>
                        <Balls vertical={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;