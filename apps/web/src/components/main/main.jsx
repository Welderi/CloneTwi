import React from "react";
import {Link} from "react-router-dom";

function Main(){
    return(
        <div>
            <Link to={"/addPost"}>Add Post</Link>
        </div>
    );
}

export default Main;