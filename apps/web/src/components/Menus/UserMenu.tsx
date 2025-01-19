import {  ReactNode } from "react";
import { NavLink } from "@base/components";
import { toast } from "react-toastify";
import { config } from "@base/config";
import { useNavigate } from "react-router";
import { useApi, useAuthStore } from "hooks";
import avatar from '@base/assets/images/user.svg';
import { Button } from "ui";
import { excerpt } from "functions";

export function UserMenu(): ReactNode {
    const navigate = useNavigate()
    const { user, logout, isSuperuser } = useAuthStore()
    const { Client, RequestState } = useApi<User>({  url: '/auth' })

    const handleLogout = async () => {
        toast('Deconnexion en cours', {
            type: 'info',
            isLoading: RequestState.creating,
            position: config.toastPosition
        })
        const response = await logout(Client)
        if (response.ok) {
            toast('Deconnecté', {
                type: 'success',
                position: config.toastPosition
            })
        } else {
            toast(response.statusText, {
                type: 'error',
                position: config.toastPosition
            })
        }
        navigate('/auth/login', {replace: true})
    }

    return <div className="app-utility-item app-user-dropdown dropdown">
        <a className="dropdown-toggle" id="user-dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
            <img src={avatar} style={{ width: 30 }} alt="user profile" />
            {excerpt(user?.name)} ({user?.role})
        </a>
        <ul className="dropdown-menu" aria-labelledby="user-dropdown-toggle">
            <li><NavLink className="dropdown-item" to="/auth/account">Mon compte</NavLink></li>
            <li><NavLink className="dropdown-item" to="/auth/settings">Paramètres</NavLink></li>
            {isSuperuser && <>
                <li><NavLink className="dropdown-item" to="/auth/users">Utilisateurs</NavLink></li>
                <li><NavLink className="dropdown-item" to="/auth/access-request">Demandes d'accès</NavLink></li>
            </>}
            <li><hr className="dropdown-divider" /></li>
            <li><Button onClick={handleLogout} className="dropdown-item shadow-none fw-normal">Se deconnecter</Button></li>
        </ul>
    </div>
}