import React, { useState } from 'react';
import '../User/user.css';

async function getVoucher(input) {
    return fetch('http://localhost:5002/get_redeem/' +  input.name)
        .then(async (res) => { 
            return await res.json()
        })
        .catch(e => {
            return "Error"
        })
}

export default function GetVoucher() {
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
            var result = await getVoucher({
                "name": name.replace(" ", "%20")
            });

            if (result == "Error") {
                setError("Unable to find voucher")
            } else if (result.data.length > 0){
                setResult(result.data);
            }
        }
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Get Voucher Details</h4>
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
                                <h2>Voucher Details</h2>
                                <p>Name: <b>{result[0]}</b></p>
                                <p>Level: <b>{result[1]}</b></p>
                            </>
                        }
                    </div>
                    }
                    </form>
            </div>
        </div>
    )
}