// import st from './register.module.css';
import React, {useState} from "react";
import {Link} from "react-router-dom";

function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [message, setMessage] = useState("");

    const register = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userName: username,
                    Email: email,
                    Password: password,
                    ConfirmPassword: repassword
                })
            });

            const result = await response.text();
            setMessage(result);
        } catch (err) {
            console.error(err);
        }
    }

    return(
        <div>
            <h2>Sign In</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="text" value={repassword} onChange={(e) => setRepassword(e.target.value)}/>
            <button onClick={register}>Sign In</button>
            <p>{message}</p>
            <Link to="/">Main</Link>
        </div>
    );
}

export default Register;