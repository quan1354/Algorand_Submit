import React from 'react';
import { useNavigate } from "react-router-dom";
import './navbar.css';

export default function NavBar(role) {
    const navigate = useNavigate();

    const ToUserPage = () => { navigate("/user") }

    const ToHomePage = () => { navigate("/") }

    const ToMenuPage = () => { navigate("/menu") }

    const Logout = () => { navigate("/logout") }

    const EditUserBlock = () => {
        if (role.role !== "admin")
            return;

        return (
            <button className={"nav_block"} onClick={ToUserPage}>
                User Management
            </button>
        )
    }

    return (
        <div id="nav_bar" className={"sticky"}>
            <button className={"nav_block"} onClick={ToHomePage}>
                Start Order
            </button>
            <button className={"nav_block"} onClick={ToMenuPage}>
                Edit Menu
            </button>
            <EditUserBlock />
            <button className={"nav_block"} onClick={Logout}>
                Log Out
            </button>
        </div>
    );
}