//https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './login.css';

async function loginUser(credentials) {
    return fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        body: JSON.stringify(credentials)
    })
        .then(data => { return data.json() })
}

export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        setToken(token);
    }

    return (
        <div className="login_background">
            <div className="login">
                <h4>Login</h4>
                <form onSubmit={handleSubmit}>
                    <div className="text_area">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            className="text_input"
                            onChange={e => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="text_area">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            className="text_input"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};