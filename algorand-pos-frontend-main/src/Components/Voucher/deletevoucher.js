import React, { useState } from 'react';
import '../User/user.css';

async function deleteVoucher(input) {
    return fetch('http://localhost:5002/delete_redeem/' +  input.name)
        .then(async (res) => { 
            return await res.json()
        })
        .catch(e => {
            return "Error"
        })
}

export default function DeleteVoucher() {
    const [name, setName] = useState();
    const [result, setResult] = useState();
    const [error, setError] = useState();

    const backToVoucherManagement = async e => {
        e.preventDefault();
        window.location = "/voucher";
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null)
        if (name) {
            var response = await deleteVoucher({
                "name": name.replace(" ", "%20")
            });

            if (response == "Error") {
                setError("Unable to find voucher")
            } else if (response.data.length > 0){
                setResult(response.data);
            }
        }
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Delete Voucher</h4>
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
                    <button className="btn" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="btn" onClick={backToVoucherManagement}> Back </button>
                    
                    <br />
                    <br />

                    {result && 
                    <div style={{textAlign:'left'}}>
                        <hr />

                        {error &&
                            <p style={{color:'red'}}>{error}</p>
                        }

                        {!error &&
                            <>
                                <p>Voucher deleted!</p>
                            </>
                        }
                    </div>
                    }
                    </form>
            </div>
        </div>
    )
}