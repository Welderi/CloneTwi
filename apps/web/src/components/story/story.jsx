import React from "react";
import VideoImageShow from "../messageController/videoImageShow";

function Story({ story }){
    return(
        <div>
            <VideoImageShow message={story}/>
        </div>
    );
}

export default Story;