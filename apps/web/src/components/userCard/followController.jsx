import { useState, useEffect } from "react";
import SignalRUser from "../signalR/signalRUser";

const useFollowController = (user) => {
    const [count, setCount] = useState(null);
    const [isFollowed, setIsFollowed] = useState(false);

    const followOrUnfollow = async (url) => {
        try {
            console.log(user.id);
            await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(user.id)
            });
        } catch (err) {
            console.log("Follow Error: ", err);
        }
    }

    const follow = async () => {
        await followOrUnfollow("http://localhost:5000/api/follow/addfollow");
        setIsFollowed(true);
    };

    const unfollow = async () => {
        await followOrUnfollow("http://localhost:5000/api/follow/removefollow");
        setIsFollowed(false);
    };

    useEffect(() => {
        const getCountofFollowers = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/follow/getcountoffollowers/${user.id}`, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                setCount(data.followersCount ?? data);
            } catch (err) {
                console.log("Count of followers error: ", err);
            }
        };

        getCountofFollowers();
    }, [user.id]);

    useEffect(() => {
        const fetchIsFollowed = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/follow/getisfollowed/${user.id}`, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                setIsFollowed(data);
            } catch (err) {
                console.log("IsFollow Error: ", err)
            }
        };

        fetchIsFollowed();

        const connection = SignalRUser();

        connection.on("follow", (data) => {
            if (data.followersCount !== undefined) {
                setCount(data.followersCount);
            }
        });

        return () => connection.stop();
    }, [user.id]);

    return { follow, unfollow, count, isFollowed };
};

export default useFollowController;
