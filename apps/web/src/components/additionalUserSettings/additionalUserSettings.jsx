import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";
import { person, profileBack, logo, camera } from "../../images";
import st from "../userProfile/userProfile.module.css";
import stI from "./additionalUserSettings.module.css";
import gSt from "../globalStyle/globalStyle.module.css";
import WebBalls from "../globalStyle/webBalls";

function AdditionalUserSettings() {
    const [bio, setBio] = useState("");
    const [editingBio, setEditingBio] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [background, setBackground] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [backgroundPreview, setBackgroundPreview] = useState(null);
    const [user, setUser] = useState(null);

    const fileInputAvatarRef = useRef(null);
    const fileInputBackRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const data = await fetchMethodGet(
                "http://localhost:5000/api/user/getuserinfo"
            );
            setUser(data);
            if (data?.bio) setBio(data.bio);
            if (data?.profileImageUrl)
                setPreviewUrl(`http://localhost:5000${data.profileImageUrl}`);
            if (data?.background)
                setBackgroundPreview(`http://localhost:5000${data.background}`);
        };
        fetchUser();
    }, []);

    const addSettings = async (image = imageUrl, newBio = bio, back = background) => {
        const form = new FormData();
        if (newBio) form.append("Bio", newBio);
        if (image instanceof File) form.append("ProfileImageUrl", image);
        if (back instanceof File) form.append("Background", back);

        try {
            await fetch("http://localhost:5000/api/user/additionalsettings", {
                method: "POST",
                credentials: "include",
                body: form
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageUrl(file);
            setPreviewUrl(URL.createObjectURL(file));
            addSettings(file, bio, background);
        }
    };

    const handleBackgroundChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBackground(file);
            setBackgroundPreview(URL.createObjectURL(file));
            addSettings(imageUrl, bio, file);
        }
    };

    if (!user) {
        return <p>Načítání uživatele…</p>;
    }

    return (
        <div
            style={{
                overflow: "hidden",
                position: "relative",
                backgroundColor: "rgba(248, 248, 248, 1)"
            }}
        >
            <WebBalls />
            <img src={logo} alt="logo" style={{ margin: "40px" }} />
            <div style={{ margin: "0px 100px" }}>
                <h1>Tvůj profil</h1>
                <p>
                    Tvůj profil ve výchozím režimu. Přidej avatar, pozadí a citát,
                    aby byl skutečně tvůj
                </p>
            </div>
            <div className={stI.card} style={{ position: "relative" }}>
                <img
                    src={backgroundPreview || profileBack}
                    alt="pozadí"
                    className={`${st.back}`}
                />
                <div
                    onClick={() => fileInputBackRef.current.click()}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        cursor: "pointer",
                        zIndex: "3"
                    }}
                >
                    <img src={camera} alt="pozadí" />
                </div>

                <input
                    ref={fileInputBackRef}
                    type="file"
                    onChange={handleBackgroundChange}
                    accept="image/*"
                    style={{ display: "none" }}
                />

                <div className={st.profile}>
                    <img
                        src={previewUrl || person}
                        alt="Profil"
                        className={st.profileImg}
                        onClick={() => fileInputAvatarRef.current.click()}
                        style={{ cursor: "pointer" }}
                    />
                    <input
                        ref={fileInputAvatarRef}
                        type="file"
                        onChange={handleAvatarChange}
                        accept="image/*"
                        style={{ display: "none" }}
                    />

                    <div className={st.profileInfo}>
                        <p style={{ fontSize: "36px" }}>{user.userName}</p>

                        {editingBio ? (
                            <input
                                type="text"
                                value={bio}
                                autoFocus
                                onChange={(e) => setBio(e.target.value)}
                                onBlur={() => {
                                    setEditingBio(false);
                                    addSettings(imageUrl, bio, background);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setEditingBio(false);
                                        addSettings(imageUrl, bio, background);
                                    }
                                }}
                                style={{
                                    outline: "none",
                                    border: "none",
                                    background: "transparent",
                                    width: "100%",
                                    color: "white",
                                    fontSize: "16px",
                                    lineHeight: "30px",
                                    padding: "0 0 0 16px",
                                    margin: 0,
                                    cursor: "text"
                                }}
                            />
                        ) : (
                            <p
                                style={{
                                    fontSize: "16px",
                                    lineHeight: "30px",
                                    cursor: "pointer",
                                    margin: 0,
                                    paddingLeft: "16px"
                                }}
                                onClick={() => setEditingBio(true)}
                            >
                                <strong style={{ visibility: bio ? "visible" : "hidden" }}>
                                    "
                                </strong>
                                {bio || "Vyber bio"}
                                <strong style={{ visibility: bio ? "visible" : "hidden" }}>
                                    "
                                </strong>
                            </p>
                        )}

                        <p>
                            Moje příspěvky:
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            Sledující:
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            Sleduji:
                        </p>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "100px 0 50px 0"
                }}
            >
                <Link to="/login" className={gSt.blueBtn} style={{ padding: "10px" }}>
                    Přihlásit se do jiného účtu
                </Link>
                <Link to="/register" className={gSt.blueBtn} style={{ padding: "10px" }}>
                    Zaregistrovat jiný účet
                </Link>
                <Link to="/changePassword" className={gSt.blueBtn} style={{ padding: "10px" }}>
                    Změnit heslo
                </Link>
            </div>
        </div>
    );
}

export default AdditionalUserSettings;
