import React, {useEffect, useState} from "react";
import st from "./more.module.css";
import {today, pin, repostIcon} from "../../images";
import fetchMethodPost from "../fetchMethods/fetchMethodPost";

function More({message, bookmarkBool, repostBool}){
    const [bookmark, setBookmark] = useState(bookmarkBool);
    const [repost, setRepost] = useState(repostBool);

    useEffect(() =>{
        setBookmark(bookmarkBool);
        setRepost(repostBool);
    }, [bookmarkBool, repostBool])

    const addBookmark = async () => {
        const form = new FormData();
        form.append("MessageId", message.messageId);

        const res = await fetchMethodPost("http://localhost:5000/api/bookmark/addbookmark", form);

        console.log(res);
    };

    const removeBookmark = async (messageId) => {
        const res = await fetch(`http://localhost:5000/api/bookmark/removebookmark/${messageId}`,{
            method: "DELETE",
            credentials: "include",
        })

        console.log(res);
    };

    const addRepost = async () => {
        const form = new FormData();
        form.append("MessageId", message.messageId);

        const res = await fetchMethodPost("http://localhost:5000/api/repost/addrepost", form);

        console.log(res);
    };

    const removeRepost = async (messageId) => {
        const res = await fetch(`http://localhost:5000/api/repost/removerepost/${messageId}`,{
            method: "DELETE",
            credentials: "include",
        })

        console.log(res);
    };

    return(
        <div className={st.div}>
            <button className={st.bookmark}
                    onClick={async () => {
                        if (!bookmark) {
                            await addBookmark();
                            setBookmark(true);
                        } else {
                            await removeBookmark(message.messageId);
                            setBookmark(false);
                        }
                    }}>
                <div className={st.hover}>
                    <div className={st.circle}>
                        {!bookmark ?
                            <img src={pin} alt="pin"/> :
                            <img src={today} alt="today"/>}
                    </div>
                    <p>Зберегти</p>
                </div>
            </button>
            <button className={st.bookmark}
                onClick={async () => {
                    if (!repost) {
                        await addRepost();
                        setRepost(true);
                    } else {
                        await removeRepost(message.messageId);
                        setRepost(false);
                    }
                }}
            >
                <div className={st.hover}>
                    <div className={st.circle}>
                        <img src={repostIcon} alt="repost"/>
                    </div>
                    <p>Репост</p>
                </div>
            </button>
        </div>
    );
}

export default More;