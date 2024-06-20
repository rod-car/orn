import { config } from "@renderer/config";
import { useAuth } from "hooks";
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "ui";

export function UserMenu(): ReactNode {
    const navigate = useNavigate()
    const { user, logout, loading } = useAuth({ baseUrl: config.baseUrl })
    const localUser = user()
    const userData = localUser && localUser.name ? localUser : null

    const handleLogout = async (): Promise<void> => {
        toast('Deconnexion en cours', {
            type: 'info',
            isLoading: loading,
            position: config.toastPosition
        })
        const response = await logout()
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
            {userData?.name}
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