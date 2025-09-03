import React, {useState} from "react";
import {Link} from "react-router-dom";

function AdditionalUserSettings(){
    const [bio, setBio] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [message, setMessage] = useState("");

    const addFile = (e) => {
        setImageUrl(e.target.files[0])
    };

    const addSettings = async () => {
        const form = new FormData();
        if(bio)
            form.append("Bio", bio);
        if(imageUrl)
            form.append("ProfileImageUrl", imageUrl)

        try{
            const response = await fetch("http://localhost:5000/api/user/additionalsettings", {
                method: "POST",
                credentials: "include",
                body: form
            });

            const result = await response.text();
            setMessage(result);
        }
        catch (err){
            console.error(err);
        }
    };

    return(
      <div>
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)}/>
          <input type="file" onChange={addFile} accept="image/*"/>
          <p>{message}</p>
          <button onClick={addSettings}>Save</button>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/changePassword">Change Password</Link>
      </div>
    );
}

export default AdditionalUserSettings;