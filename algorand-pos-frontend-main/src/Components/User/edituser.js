import React, { useState } from 'react';
import './user.css';

async function searchUser(credentials) {
    return fetch('http://localhost:8080/searchUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function EditUser() {
    const [username, setUserName] = useState();

    const backToUserManagement = async e => {
        e.preventDefault();
        window.location = "/user";
    }

    const handleSubmit = async e => {
        e.preventDefault();
        /*
        const token = await searchUser({
            username
        });
        */
        //window.alert("User Deleted Successfully");
        window.location = "/user";
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Search User</h4>
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
                        Search User
                    </button>
                    <button className="btn" onClick={backToUserManagement}> Back </button>
                </form>
            </div>
        </div>
    )
}