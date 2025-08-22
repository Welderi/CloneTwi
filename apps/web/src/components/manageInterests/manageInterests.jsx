import React, {useEffect, useState} from "react";
import THEMES from "../themes/themes";
import fetchMethodGet from "../fetchMethods/fetchMethodGet";

function ManageInterests(){
    const [interests, setInterests] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);

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
            await fetch(`http://localhost:5000/api/interest/removeinterest/${theme}`, {
                method: "DELETE",
                credentials: "include"
            });
            setInterests(prev => prev.filter(x => x !== theme));
        } else {
            removeItem(theme);
        }
    };

    return(
        <div>
            {THEMES.map((theme, index) => (
                <label key={index}>
                    <input
                        type="checkbox"
                        checked={interests.includes(theme) || selectedItem.includes(theme)}
                        onChange={e => {
                            if (e.target.checked) {
                                addItem(theme);
                            } else {
                                removeInterest(theme);
                            }
                        }}
                    />
                    {theme}
                </label>
            ))}
            <button onClick={addInterest}>Save</button>
        </div>
    );
}

export default ManageInterests;
