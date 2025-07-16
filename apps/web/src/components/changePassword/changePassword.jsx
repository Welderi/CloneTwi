import React, {useState} from "react";

function ChangePassword(){
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const changePassword = async () => {
        try{
            const response = await fetch("http://localhost:5000/api/user/changepassword", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    CurrentPassword: password,
                    NewPassword: newPassword
                })
            });

            const result = await response.text();
            setMessage(result);
        }
        catch (err){
            console.error(err);
        }
    }

    return(
        <div>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
            <p>{message}</p>
            <button onClick={changePassword}>Change Password</button>
        </div>
    );
}

export default ChangePassword;