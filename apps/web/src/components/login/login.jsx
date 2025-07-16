// import st from './login.module.css';
import React, {useState} from "react";
import {Link} from "react-router-dom";

function Login(){
    const [usernameEmail, setUsernameEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const login = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    UserNameEmail: usernameEmail,
                    Password: password
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
            <h2>Login</h2>
            <input type="text" value={usernameEmail} onChange={(e) => setUsernameEmail(e.target.value)}/>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={login}>Log In</button>
            <p>{message}</p>
            <Link to="/">Main</Link>
        </div>
    );
}

export default Login;