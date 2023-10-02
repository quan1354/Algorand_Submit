import React from 'react';
import { useNavigate } from "react-router-dom";
import '../../App.css';
import './user.css';

const UserManagement = () => {
    const navigate = useNavigate();
    const AddUser = () => { navigate("/user/adduser") }
    const EditUser = () => { navigate("/user/edituser") }
    const ResetPassword = () => { navigate("/user/resetpassword") }
    const DeleteUser = () => { navigate("/user/deleteuser") }

    return (
        <div className="App UserContainer">
            <div className="ButtonContents">
                <div className='ButtonRow'>
                    <button className='BigButton' onClick={AddUser}>Add User</button>
                    <button className='BigButton' onClick={EditUser}>Edit User</button>
                </div>
                <div className='ButtonRow'>
                    <button className='BigButton' onClick={ResetPassword}>Reset Password</button>
                    <button className='BigButton' onClick={DeleteUser}>Delete User</button>
                </div>
            </div>
        </div>
    );

}

export default UserManagement;