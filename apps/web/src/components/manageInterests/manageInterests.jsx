import React, {useEffect, useState} from "react";
import THEMES from "../themes/themes";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";
import gSt from "../globalStyle/globalStyle.module.css";
import st from "./manageInterests.module.css";
import Balls from "../animation/animation";
import {girl3, logo, undo} from "../../images";
import {Link} from "react-router-dom";

function ManageInterests(){
    const [interests, setInterests] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [hoveredTheme, setHoveredTheme] = useState(null);

    const addItem = (item) => {
        setSelectedItem(prev => [...new Set([...prev, item])]);
    };

    const removeItem = (item) => {
        setSelectedItem(prev => prev.filter(x => x !== item));
    };

    useEffect(() => {
        const fetchInterests = async () => {
            const data = await fetchMethodGet("http://localhost:5000/api/interest/getallinterestsforuser");
            setInterests((data || []).map(d => d.topic));
        };
        fetchInterests();
    }, [])

    const addInterest = async () => {
        if (selectedItem.length === 0) return;

        const form = selectedItem.map(topic => ({ topic }));

        await fetch("http://localhost:5000/api/interest/addrangeinterests", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        setInterests(prev => [...new Set([...prev, ...selectedItem])]);
        setSelectedItem([]);
    };

    const removeInterest = async (theme) => {
        if (interests.includes(theme)) {
            await fetch("http://localhost:5000/api/interest/removeinterest", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(theme),
                credentials: "include"
            });
            setInterests(prev => prev.filter(x => x !== theme));
        } else {
            removeItem(theme);
        }
    };

    const resetSelection = async () => {
        try {
            for (const theme of interests) {
                removeInterest(theme);
            }

            setInterests([]);
            setSelectedItem([]);
        } catch (err) {
            console.error("Reset error:", err);
        }
    };

    return(
        <div className={`${gSt.div} ${st.div}`}>
            <div className={st.forBalls}>
                <img src={logo}
                     alt="Dumka Logo"
                />
                <div className={st.hText}>
                    <h1>Сформуй свою срічку</h1>
                    <p style={{margin: "-15px 5px"}}>Обирай, що тобі до душі</p>
                </div>
                <div className={`${gSt.ballsWrapper} ${st.ballsWrapper}`}>
                    <Balls vertical={true}/>
                </div>
            </div>
            <div className={`${gSt.mainDiv} ${st.mainDiv}`}>
                <div className={st.interests}>
                    {Object.keys(THEMES).map((themeKey) => (
                        <label key={themeKey}
                               onMouseEnter={() => setHoveredTheme(themeKey)}
                               onMouseLeave={() => setHoveredTheme(null)}
                               style={{cursor: "pointer"}}>
                            <input
                                type="checkbox"
                                checked={interests.includes(themeKey) || selectedItem.includes(themeKey)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        addItem(themeKey);
                                    } else {
                                        removeInterest(themeKey);
                                    }
                                }}
                            />
                            {themeKey}
                        </label>
                    ))}

                </div>
                <div>
                    <div className={`${st.trWindow} ${gSt.trWindow}`}>
                        {hoveredTheme && (
                            <div className={st.itemsList}>
                                <p>Про:</p>
                                <div className={st.item}>
                                    {THEMES[hoveredTheme].map((item) => (
                                        <p key={item}>{item}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                        <img
                            src={girl3}
                            style={{ position: "absolute", bottom: "-10px" }}
                            alt=""
                        />
                    </div>
                </div>
            </div>
                <div className={st.buttonList}>
                    <Link to={'/helper'}>
                        <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}
                                style={{
                                    width: "215px",
                                    height: "40px"
                                }}>
                            <img src={undo}
                                 alt=""/>Думку змінено
                        </button>
                    </Link>
                    <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}
                            style={{
                                width: "215px",
                                height: "40px"
                            }}
                            onClick={resetSelection}>
                        Скинути вибір
                    </button>
                    <Link to={'/main'}>
                        <button className={`${gSt.blueBtn} ${gSt.undoBtn}`}
                                style={{
                                    width: "215px",
                                    height: "40px"
                                }}
                                onClick={addInterest}>
                            Мій вибір готовий
                        </button>
                    </Link>
                </div>
        </div>
    );
}

export default ManageInterests;
