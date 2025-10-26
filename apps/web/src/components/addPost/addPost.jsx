import React, { useEffect, useState } from "react";
import createMessageAsync from "../messageController/createMessage";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";
import CreatableSelect from "react-select/creatable";
import THEMES from "../themes/themes";
import Balls from "../animation/animation";
import gSt from "../globalStyle/globalStyle.module.css";
import st from "./addPost.module.css";
import {undo} from "../../images";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AddPost() {
    const navigate = useNavigate();

    const [messageText, setMessageText] = useState("");
    // const [message, setMessage] = useState("");
    const [videoImage, setVideoImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [allThemes, setAllThemes] = useState(Object.keys(THEMES));
    const [isStory, setIsStory] = useState(false);
    const [selectedThemes, setSelectedThemes] = useState([]);

    const addFile = (e) => {
        setVideoImage(Array.from(e.target.files));
    };

    const createMessage = async () => {
        const messageForm = {
            isParent: false,
            messageText,
            messageParentId: null,
            videoImage,
            audioMessage: audio,
            isStory,
            themes: selectedThemes.map((t) => t.value),
        };

        const result = await createMessageAsync(messageForm);
        // setMessage(result);

        // console.log(result)

        if (result && !result.errors) {
            navigate("/main");
        }
    };

    useEffect(() => {
        const getAllThemes = async () => {
            const data = await fetchMethodGet("http://localhost:5000/api/theme/getallthemes");
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
                <h1 className={st.h1}>Створи свій пост</h1>
                <div className={`${gSt.ballsWrapper} ${st.ballsWrapper}`}>
                    <Balls vertical={true} />
                </div>
                <div className={`${gSt.centerDiv}`}>
                    <div className={`${gSt.trWindow} ${st.trWindow}`}>
                        <input
                            type="text"
                            className={gSt.input}
                            value={messageText}
                            placeholder="Що нового?"
                            onChange={(e) => setMessageText(e.target.value)}
                        />

                        <div className={st.fileWrapper}>
                            <label htmlFor="videoImage" className={`${gSt.blueBtn} ${st.fileBtn}`}>
                                Завантажити фото/відео
                            </label>
                            <input
                                id="videoImage"
                                type="file"
                                className={st.hiddenInput}
                                onChange={addFile}
                                accept="image/*,video/*"
                                multiple
                            />

                            <label htmlFor="audioFile" className={`${gSt.blueBtn} ${st.fileBtn}`}>
                                Завантажити аудіо
                            </label>
                            <input
                                id="audioFile"
                                type="file"
                                className={st.hiddenInput}
                                onChange={(e) => setAudio(e.target.files[0])}
                                accept="audio/*"
                            />
                        </div>

                        <div className={st.storyCheck}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isStory}
                                    onChange={(e) => setIsStory(e.target.checked)}
                                />
                                Додати у сторіс
                            </label>
                        </div>

                        <div className={st.selectWrapper}>
                            <CreatableSelect
                                isMulti
                                options={themeOptions}
                                value={selectedThemes}
                                onChange={setSelectedThemes}
                                placeholder="Вибери або створи"
                                noOptionsMessage={() => "Немає варіантів"}
                            />
                        </div>

                        {/*{message && <p className={gSt.error}>{message}</p>}*/}

                        <button onClick={createMessage} className={`${gSt.blueBtn} ${st.createBtn}`}>
                            Створити
                        </button>
                    </div>
                </div>
            </div>
            <Link to={"/main"}>
                <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}
                ><img src={undo} alt=""/>Думку змінено</button>
            </Link>
        </div>
    );
}

export default AddPost;
