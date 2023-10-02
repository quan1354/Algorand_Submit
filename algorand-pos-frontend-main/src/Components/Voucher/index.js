import React from 'react';
import { useNavigate } from "react-router-dom";
import '../../App.css';
import '../User/user.css';

const VoucherManagement = () => {
    const navigate = useNavigate();
    const AddVoucher = () => { navigate("/voucher/add") }
    const GetVoucher = () => { navigate("/voucher/get") }
    const DeleteVoucher = () => { navigate("/voucher/delete") }
    const RedeemVoucher = () => { navigate("/voucher/redeem") }

    return (
        <div className="App UserContainer">
            <div className="ButtonContents">
                <div className='ButtonRow'>
                    <button className='BigButton' onClick={AddVoucher}>Add Voucher</button>
                    <button className='BigButton' onClick={GetVoucher}>Get Vouchers</button>
                </div>
                <div className='ButtonRow'>
                    <button className='BigButton' onClick={DeleteVoucher}>Delete Voucher</button>
                    <button className='BigButton' onClick={RedeemVoucher}>Redeem Voucher</button>
                </div>
            </div>
        </div>
    );

}

export default VoucherManagement;