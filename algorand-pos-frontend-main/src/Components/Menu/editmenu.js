import React, { useState } from 'react';
import './menu.css';

async function editMenu(credentials) {
    return fetch('http://localhost:5000/editmenu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(data => { window.alert("Success"); window.location = "/menu"; })
    .catch(e => window.alert("failed"))
}

export default function EditMenu() {
    const [item1, setItemName1] = useState();
    const [item2, setItemName2] = useState();

    const backToMenuManagement = async e => {
        e.preventDefault();
        window.location = "/menu";
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await editMenu({
            item1,
            item2
        });
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Edit item</h4>
                <form>
                    <div className="text_area">
                        <input
                            type="text"
                            id="item1"
                            name="item1"
                            placeholder="Current Item Name"
                            className="text_input"
                            onChange={e => setItemName1(e.target.value)}
                        />
                    </div>
                    <div className="text_area">
                        <input
                            type="text"
                            id="item2"
                            name="item2"
                            placeholder="New Item Name"
                            className="text_input"
                            onChange={e => setItemName2(e.target.value)}
                        />
                    </div>
                    <button className="btn" onClick={handleSubmit}>
                        Edit item
                    </button>
                    <button className="btn" onClick={backToMenuManagement}> Back </button>
                </form>
            </div>
        </div>
    )
}