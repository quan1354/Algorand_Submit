import React, { useState } from 'react';
import './menu.css';

async function addMenu(credentials) {
    return fetch('http://localhost:5000/addmenu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        body: JSON.stringify(credentials)
    })
        .then(data => { window.alert("Success"); window.location = "/Menu"; })
        .catch(e => window.alert("failed"))
}

export default function AddMenu() {
    const [item, setItem] = useState();

    const backToMenuManagement = async e => {
        e.preventDefault();
        window.location = "/menu";
    }

    const handleSubmit = async e => {
        e.preventDefault();
         addMenu({
            "item": item
        });
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Add Menu</h4>
                <form>
                    <div className="text_area">
                        <input
                            type="text"
                            id="item"
                            name="item"
                            placeholder="Item"
                            className="text_input"
                            onChange={e => setItem(e.target.value)}
                        />
                    </div> 
                    <button className="btn" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="btn" onClick={backToMenuManagement}> Back </button>
                </form>
            </div>
        </div>
    )
}