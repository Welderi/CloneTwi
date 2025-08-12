import React, {useCallback, useEffect, useState} from "react";
import SignalRUser from "../signalR/signalRUser";

function UserCard({ user }){
    const [isFollowed, setIsFollowed] = useState(false);
    const [countFollowers, setCountFollowers] = useState(0);

    const followOrUnfollow = async (url) => {
        try {
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(user.id)
            })
        } catch (err){
            console.log("Follow Error: ", err);
        }
    }

    const follow = async () => {
        followOrUnfollow("http://localhost:5000/api/follow/addfollow");
        setIsFollowed(true);
    };

    const unfollow = async () => {
        followOrUnfollow("http://localhost:5000/api/follow/removefollow");
        setIsFollowed(false);
    };

    useEffect(() => {
        const getCountofFollowers = async () => {
            try{
                const res = await fetch(`http://localhost:5000/api/follow/getcountoffollowers/${user.id}`, {
                    method: "GET",
                    credentials: "include"
                });

                const data = await res.json();

                setCountFollowers(data.followersCount ?? data);
            } catch (err){
                console.log("Count of followers error: ", err);
            }
        };

        getCountofFollowers();
    }, [user.id]);

    useEffect(() => {
        const fetchIsFollowed = async () => {
            try{
                const res = await fetch(`http://localhost:5000/api/follow/getisfollowed/${user.id}`, {
                    method: "GET",
                    credentials: "include"
                });

                const data = await res.json();

                setIsFollowed(data);
            } catch (err){
                console.log("IsFollow Error: ", err)
            }
        };

        fetchIsFollowed();

        const connection = SignalRUser();

        connection.on("follow", (data) => {
            if (data.followersCount !== undefined) {
                setCountFollowers(data.followersCount);
            }
        });

        return () => connection.stop();
    }, [user.id])

    const handleFollowClick = () => {
        if(isFollowed) unfollow();
        else follow();
    };

    return(
        <div>
            <img src={user.profileImageUrl} alt=""/>
            <p>{user.userName}</p>
            <p>{countFollowers}</p>

            <button onClick={handleFollowClick}>{isFollowed ? "Unfollow" : "Follow"}</button>
        </div>
    );
}

export default UserCard;