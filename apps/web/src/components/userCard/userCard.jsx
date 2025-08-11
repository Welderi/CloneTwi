import React, {useEffect, useState} from "react";

function UserCard({ user }){
    const [isFollowed, setIsFollowed] = useState(false);

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
        const fetchIsFollowed = async () => {
            try{
                const res = await fetch(`http://localhost:5000/api/follow/getisfollowed/${user.id}`, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                console.log("Data: ", data);
                setIsFollowed(data);
            } catch (err){
                console.log("IsFollow Error: ", err)
            }
        };
        
        fetchIsFollowed();
    }, [user.id])

    const handleFollowClick = () => {
        if(isFollowed)
            unfollow();
        else
            follow();
    };

    return(
        <div>
            <img src={user.profileImageUrl} alt=""/>
            <p>{user.userName}</p>

            <button onClick={handleFollowClick}>{isFollowed ? "Unfollow" : "Follow"}</button>
        </div>
    );
}

export default UserCard;