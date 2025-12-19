import React, { useEffect, useState } from "react";
import createMessageAsync from "../messageController/createMessage";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";
import CreatableSelect from "react-select/creatable";
import THEMES from "../themes/themes";
import Balls from "../animation/animation";
import gSt from "../globalStyle/globalStyle.module.css";
import st from "./addPost.module.css";
import { undo } from "../../images";
import { Link, useNavigate } from "react-router-dom";

function AddPost() {
    const navigate = useNavigate();

    const [messageText, setMessageText] = useState("");
    const [videoImage, setVideoImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [allThemes, setAllThemes] = useState(Object.keys(THEMES));
    const [isStory, setIsStory] = useState(false);
    const [selectedThemes, setSelectedThemes] = useState([]);

    const addFile = (e) => {
        setVideoImage(Array.from(e.target.files));
    };

    useEffect(() => {
        if (isStory) {
            setMessageText("");
            setAudio(null);
            setSelectedThemes([]);
        }
    }, [isStory]);

    const createMessage = async () => {
        if (isStory && (!videoImage || videoImage.length === 0)) {
            alert("Story musí obsahovat foto nebo video");
            return;
        }

        const messageForm = {
            isParent: false,
            messageText: isStory ? "" : messageText,
            messageParentId: null,
            videoImage,
            audioMessage: isStory ? null : audio,
            isStory,
            themes: isStory ? [] : selectedThemes.map((t) => t.value),
        };

        const result = await createMessageAsync(messageForm);
        if (result && !result.errors) {
            navigate("/main");
        }
    };

    useEffect(() => {
        const getAllThemes = async () => {
            const data = await fetchMethodGet(
                "http://localhost:5000/api/theme/getallthemes"
            );
            setAllThemes((prev) => [...new Set([...prev, ...data])]);
        };
        getAllThemes();
    }, []);

    const themeOptions = allThemes.map((key) => ({
        value: key,
        label: key,
    }));

    return (
        <div className={gSt.div}>
            <div className={`${st.mainDiv} ${st.formWrapper}`}>

                <div className={st.header}>
                    <h1 className={st.h1}>Vytvoř svůj příspěvek</h1>

                    <div className={st.storyToggle}>
                        <span>Post</span>
                        <label className={st.switch}>
                            <input
                                type="checkbox"
                                checked={isStory}
                                onChange={(e) => setIsStory(e.target.checked)}
                            />
                            <span className={st.slider}></span>
                        </label>
                        <span>Story</span>
                    </div>
                </div>

                <div className={`${gSt.ballsWrapper} ${st.ballsWrapper}`}>
                    <Balls vertical />
                </div>

                <div className={gSt.centerDiv}>
                    <div className={`${gSt.trWindow} ${st.trWindow}`}>

                        {!isStory && (
                            <input
                                type="text"
                                className={gSt.input}
                                value={messageText}
                                placeholder="Co je nového?"
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                        )}

                        <div className={st.fileWrapper}>
                            <label
                                htmlFor="videoImage"
                                className={`${gSt.blueBtn} ${st.fileBtn}`}
                            >
                                Nahraj foto/video
                            </label>
                            <input
                                id="videoImage"
                                type="file"
                                className={st.hiddenInput}
                                onChange={addFile}
                                accept="image/*,video/*"
                                multiple
                            />

                            {!isStory && (
                                <>
                                    <label
                                        htmlFor="audioFile"
                                        className={`${gSt.blueBtn} ${st.fileBtn}`}
                                    >
                                        Nahraj audio
                                    </label>
                                    <input
                                        id="audioFile"
                                        type="file"
                                        className={st.hiddenInput}
                                        onChange={(e) =>
                                            setAudio(e.target.files[0])
                                        }
                                        accept="audio/*"
                                    />
                                </>
                            )}
                        </div>

                        {!isStory && (
                            <div className={st.selectWrapper}>
                                <CreatableSelect
                                    isMulti
                                    options={themeOptions}
                                    value={selectedThemes}
                                    onChange={setSelectedThemes}
                                    placeholder="Vyber nebo vytvoř"
                                />
                            </div>
                        )}

                        <button
                            onClick={createMessage}
                            className={`${gSt.blueBtn} ${st.createBtn}`}
                        >
                            Vytvořit
                        </button>
                    </div>
                </div>
            </div>

            <Link to="/main">
                <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}>
                    <img src={undo} alt="" />
                    Myšlenka změněna
                </button>
            </Link>
        </div>
    );
}

export default AddPost;
