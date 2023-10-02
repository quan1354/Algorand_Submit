import React, { useState } from 'react';
import './menu.css';

async function deleteMenu(credentials) {
    return fetch('http://localhost:5000/deletemenu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => { window.alert("Success"); window.location = "/menu"; })
        .catch(e => window.alert("failed"))
}

export default function DeleteMenu() {
    const [item, setItemName] = useState();

    const backToEditMenu = async e => {
        e.preventDefault();
        window.location = "/menu";
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await deleteMenu({
            item
        });
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Delete Menu</h4>
                <form>
                    <div className="text_area">
                        <input
                            type="text"
                            id="item"
                            name="item"
                            placeholder="item"
                            className="text_input"
                            onChange={e => setItemName(e.target.value)}
                        />
                    </div>
                    <button className="btn" onClick={handleSubmit}>
                        Delete Item
                    </button>
                    <button className="btn" onClick={backToEditMenu}> Back </button>
                </form>
            </div>
        </div>
    )
}

