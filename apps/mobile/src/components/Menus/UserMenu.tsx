import {  ReactNode } from "react";
import { NavLink } from "@base/components";
import { toast } from "react-toastify";
import { config } from "@base/config";
import { useApi, useAuthStore } from "hooks";
import avatar from '@base/assets/images/user.svg';
import { Button } from "ui";
import { excerpt } from "functions";

export function UserMenu(): ReactNode {
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
            // window.location.href = "/auth/login"
        } else {
            toast(response.statusText, {
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    return <div className="app-utility-item app-user-dropdown dropdown">
        <a className="dropdown-toggle" id="user-dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
            <img src={avatar} style={{ width: 30 }} alt="user profile" />
            {excerpt(user?.name)} ({user?.role})
        </a>
        <ul className="dropdown-menu" aria-labelledby="user-dropdown-toggle">
            <li><Button onClick={handleLogout} className="dropdown-item shadow-none fw-normal">Se deconnecter</Button></li>
        </ul>
    </div>
}