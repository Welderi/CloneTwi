import React, {useState} from "react";
import {Link} from "react-router-dom";
import useFollowController from "./followController";

function UserCard({ user }){
    const [isFollowed, setIsFollowed] = useState(false);
    const { follow, unfollow, count } = useFollowController(user);

    const handleFollowClick = () => {
        if(isFollowed) {
            unfollow();
            setIsFollowed(false);
        }
        else {
            follow();
            setIsFollowed(true);
        };
    };

    return(
        <div>
            <img src={user.profileImageUrl} alt=""/>
            <p>{user.userName}</p>
            <p>{count}</p>

            <Link to={`/userProfile/${user.id}`}>Profile</Link>

            <button onClick={handleFollowClick}>{isFollowed ? "Unfollow" : "Follow"}</button>
        </div>
    );
}

export default UserCard;