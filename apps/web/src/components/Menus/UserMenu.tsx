import { Button } from "ui";
import {  ReactNode } from "react";
import { excerpt } from "functions";
import { config } from "@base/config";
import { toast } from "@base/ui";
import { NavLink } from "@base/components";
import { useApi, useAuthStore } from "hooks";
import avatar from '@base/assets/images/user.svg';

export function UserMenu(): ReactNode {
    const { user, logout } = useAuthStore()
    const { Client, RequestState } = useApi<User>({  url: '/auth' })

    const handleLogout = async () => {
        toast('Déconnexion en cours', {
            type: 'info',
            isLoading: RequestState.creating
        })
        const response = await logout(Client)
        if (response.ok) {
            toast('Déconnecté', {
                type: 'success'
            })
        } else {
            toast(response.statusText, {
                type: 'error'
            })
        }
    }

    return <div className="app-utility-item app-user-dropdown dropdown">
        <a className="dropdown-toggle" id="user-dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
            <img src={avatar} style={{ width: 30 }} alt="user profile" />
            {excerpt(user?.name)} ({user?.role})
        </a>
        <ul className="dropdown-menu" aria-labelledby="user-dropdown-toggle">
            <li><NavLink permission="user.show" className="dropdown-item" to="/auth/account">Mon compte</NavLink></li>
            <li><NavLink permission="user.view" className="dropdown-item" to="/user/list">Utilisateurs</NavLink></li>
            <li><NavLink permission="access-request.view" className="dropdown-item" to="/auth/access-request">Demandes d'accès</NavLink></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Button permission="*" onClick={handleLogout} className="dropdown-item shadow-none fw-normal">Se déconnecter</Button></li>
        </ul>
    </div>
}