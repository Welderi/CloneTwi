import React from "react";
import {Link} from "react-router-dom";

function Main(){
    return(
        <div>
            <h1>Choose</h1>
            <Link to={"/addPost"}>Add Post</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
            <Link to={"/changePassword"}>Change Password</Link>
            <Link to={"/userProfile"}>Profile</Link>
            <Link to={"/additionalUserSettings"}>Settings</Link>
            <Link to={""}></Link>
        </div>
    );
}

export default Main;