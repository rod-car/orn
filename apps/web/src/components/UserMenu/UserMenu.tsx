import { config } from "@renderer/config";
import { useApi, useAuthStore } from "hooks";
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "ui";

export function UserMenu(): ReactNode {
    const navigate = useNavigate()
    const { user, logout, isSuperuser } = useAuthStore()
    const { Client, RequestState } = useApi<User>({ baseUrl: config.baseUrl, url: '/auth' })

    const handleLogout = async (): Promise<void> => {
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
        navigate('/auth/login')
    }

    return <li className="nav-item dropdown ms-3">
        <NavLink
            className="nav-link dropdown-toggle"
            to="/user"
            id="user-dropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            <i className="fa fa-user me-2"></i>
            {user?.name}
        </NavLink>
        <ul
            className="dropdown-menu"
            aria-labelledby="user-dropdown"
        >
            <li>
                <NavLink
                    className="dropdown-item"
                    to="/user/account"
                >
                    <i className="fa fa-user me-2"></i> Mon compte
                </NavLink>
            </li>
            <li>
                <NavLink
                    className="dropdown-item"
                    to="/user/account"
                >
                    <i className="fa fa-cog me-2"></i> Paramètres
                </NavLink>
            </li>
            {isSuperuser && <>
                <li>
                    <NavLink
                        className="dropdown-item"
                        to="/auth/users"
                    >
                        <i className="fa fa-users me-2"></i> Utilisateurs
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className="dropdown-item"
                        to="/auth/access-request"
                    >
                        <i className="fa fa-comment-dots me-2"></i> Demandes
                    </NavLink>
                </li>
            </>}

            <li>
                <Button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item shadow-none"
                    icon="sign-out"
                >
                    Se deconnecter
                </Button>
            </li>
        </ul>
    </li>
}