import React, { useState } from 'react';
import '../User/user.css';

async function redeemVoucher(input) {
    console.log('http://localhost:5002/get_customer/' +  input.address)
    var customer_point_bal = await fetch('http://localhost:5002/get_customer/' +  input.address)
        .then(async (res) => { 
            var data = await res.json()
            return data.data[1]
        })
        .catch(e => {
            return {error: "Unable to find customer"}
        })
    if (customer_point_bal.error) return {error: customer_point_bal.error}
    
    var voucher_point_needed = await fetch('http://localhost:5002/get_redeem/' +  input.voucherName)
        .then(async (res) => { 
            var data = await res.json()
            return data.data[1]
        })
        .catch(e => {
            return {error: "Unable to find voucher"}
        })
    if (voucher_point_needed.error) return {error: voucher_point_needed.error}
        
    if (customer_point_bal >= voucher_point_needed) {
        var new_point_bal = customer_point_bal - voucher_point_needed
        return await fetch('http://localhost:5002/update_customer_point/' +  input.address + '/' + new_point_bal)
            .then(async (res) => { 
                return await res.json()
            })
            .catch(e => {
                return {error: "Unable to redeem voucher"}
            })
    } else {
        return {error: "Customer have insufficient points balance"}
    }
}

export default function RedeemVoucher() {
    const [address, setAddress] = useState();
    const [voucherName, setVoucherName] = useState();
    const [result, setResult] = useState();
    const [error, setError] = useState();

    const backToVoucherManagement = async e => {
        e.preventDefault();
        window.location = "/voucher";
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null)
        if (address && voucherName) {
            var result = await redeemVoucher({
                "address": address,
                "voucherName": voucherName.replace(" ", "%20")
            });

            if (result.error) {
                setError("Unable to find voucher")
            } else if (result.data.length > 0){
                setResult(result.data);
            }
        }
    }

    return (
        <div className="login_background">
            <div className="UserFormContainer">
                <h4>Redeem Voucher</h4>
                <form>
                    <div className="text_area">
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="address"
                            className="text_input"
                            onChange={e => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="text_area">
                        <input
                            type="text"
                            id="voucher_name"
                            name="voucher_name"
                            placeholder="voucher name"
                            className="text_input"
                            onChange={e => setVoucherName(e.target.value)}
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
                                <h2>Redeem Voucher Success!</h2>
                                <p style={{wordWrap: 'break-word'}}>Address: <b>{result[0]}</b></p>
                                <p>Current Balance: <b>{result[1]}</b></p>
                            </>
                        }
                    </div>
                    }
                    <br />
                    </form>
            </div>
        </div>
    )
}