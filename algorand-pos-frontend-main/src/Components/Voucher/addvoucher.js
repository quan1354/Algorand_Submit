import React, { useState } from 'react';
import '../User/user.css';

async function addVoucher(input) {
    return fetch('http://localhost:5002/add_redeem/' +  input.name + '/' + input.level)
        .then(data => { window.alert("Success"); window.location = "/voucher"; })
        .catch(e => window.alert("failed"))
}

export default function AddVoucher() {
    const [name, setName] = useState();
    const [level, setLevel] = useState();

    const backToVoucherManagement = async e => {
        e.preventDefault();
        window.location = "/voucher";
    }

    const handleSubmit = async e => {
        e.preventDefault();
        await addVoucher({
            "name": name.replace(" ", "%20"),
            "level": level
        });
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Add Voucher</h4>
                <form>
                    <div className="text_area">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="name"
                            className="text_input"
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="text_area">
                        <input
                            type="text"
                            id="level"
                            name="level"
                            placeholder="level"
                            className="text_input"
                            onChange={e => setLevel(e.target.value)}
                        />
                    </div>
                    <button className="btn" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="btn" onClick={backToVoucherManagement}> Back </button>
                </form>
            </div>
        </div>
    )
}