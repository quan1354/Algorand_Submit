import React, { useState } from 'react';
import './user.css';

async function deleteUser(credentials) {
    return fetch('http://localhost:5000/deleteuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => { window.alert("Success"); window.location = "/user"; })
        .catch(e => window.alert("failed"))
}

export default function DeleteUser() {
    const [username, setUserName] = useState();

    const backToUserManagement = async e => {
        e.preventDefault();
        window.location = "/user";
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await deleteUser({
            username
        });
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Delete User</h4>
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
                    <button className="btn" onClick={handleSubmit}>
                        Delete User
                    </button>
                    <button className="btn" onClick={backToUserManagement}> Back </button>
                </form>
            </div>
        </div>
    )
}