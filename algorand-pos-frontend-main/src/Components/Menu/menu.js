import React from 'react';
import { useNavigate } from "react-router-dom";
import '../../App.css';
import './menu.css';

const MenuManagement = () => {
    const navigate = useNavigate();
    const AddMenu = () => { navigate("/menu/addmenu") }
    const EditMenu = () => { navigate("/menu/editmenu") }
    // const ResetPassword = () => { navigate("/menu/") }
    const DeleteMenu = () => { navigate("/menu/deletemenu") }

    return (
        <div className="App MenuContainer">
            <div className="ButtonContents">
                <div className='ButtonRow'>
                    <button className='BigButton' onClick={AddMenu}>Add Menu</button>
                    <button className='BigButton' onClick={EditMenu}>Edit Menu</button>
                </div>
                <div className='ButtonRow'>
                    {/* <button className='BigButton' onClick={ResetPassword}>Reset Password</button> */}
                    <button className='BigButton' onClick={DeleteMenu}>Delete Menu</button>
                </div>
            </div>
        </div>
    );

}

export default MenuManagement;