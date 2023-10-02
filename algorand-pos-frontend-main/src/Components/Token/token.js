import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        return userToken?.username;
    }

    const getRole = () => {
        const tokenString = sessionStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        return userToken?.role;
    }

    const saveToken = token => {
        sessionStorage.setItem("token", JSON.stringify(token));
    }

    const clearToken = () => {
        sessionStorage.removeItem("token");
    }

    const [token, setToken] = useState(getToken());
    const [role, setRole] = useState(getRole());

    return {
        setToken: saveToken,
        clearToken: clearToken,
        token: token,
        role: role
    }
}