import React, { useState } from 'react';
import './user.css';

async function resetPassword(credentials) {
    return fetch('http://localhost:5000/resetpassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        body: JSON.stringify(credentials)
    })
        .then(data => { window.alert("Success"); window.location = "/user"; })
        .catch(e => window.alert("failed"))
}

export default function ResetPassword() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const backToUserManagement = async e => {
        e.preventDefault();
        window.location = "/user";
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (password === confirmPassword) {
            await resetPassword({
                "username": username,
                "password": password
            });
        }
        else {
            window.alert("Please check your password again!")
        }

    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Reset Password</h4>
                <form>
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
                    <div className="text_area">
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="Confirm Password"
                            className="text_input"
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn" onClick={handleSubmit}>
                        Reset Password
                    </button>
                    <button className="btn" onClick={backToUserManagement}> Back </button>
                </form>
            </div>
        </div>
    )
}