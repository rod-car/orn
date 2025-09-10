import { ReactNode, useId } from "react";
import { NavLink } from '@base/components';
import './Nav.css';
import { useLocation } from "react-router";
import { useAuthStore } from "hooks";

type DropDownProps = {
    label: string;
    icon?: string;
    base?: string;
    active?: boolean;
    permission?: string | string[];
    menus: { label: string, to: string, permission?: string | string[] }[];
}

export function DropDown({ label, base = '/', menus, icon, active, permission }: DropDownProps): ReactNode {
    const id = useId();
    const { pathname } = useLocation();
    const { isAllowed } = useAuthStore();

    if (active === undefined) {
        active = pathname.includes(base);
    }

    // Vérifie la permission globale (ou absence de restriction)
    const isAuthorized = permission ? isAllowed(permission) : true;

    if (!isAuthorized) return null;

    // Générez le menu uniquement si au moins un item est visible
    /*const visibleMenus = menus.filter(menu => {
        if (!menu.permission) return false;

        if (typeof menu.permission === 'boolean') {
            if (menu.permission === undefined || menu.permission === true) return true;
            return false;
        }

        return isAllowed(menu.permission);
    });*/

    return (
        <li className="nav-item has-submenu">
            <a className={`nav-link submenu-toggle ${active ? 'active' : ''}`} href="#" data-bs-toggle="collapse" data-bs-target={`#${id}`} aria-expanded="false" aria-controls={id}>
                {icon && <span className="h6 nav-icon">
                    <i className={`bi bi-${icon}`}></i>
                </span>}
                <span className="nav-link-text">{label}</span>
                <span className="submenu-arrow">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chevron-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                    </svg>
                </span>
            </a>
            <div id={id} className={`collapse submenu ${id}`} data-bs-parent="#menu-accordion">
                <ul className="submenu-list list-unstyled">
                    {menus.map(menu => (
                        <li key={menu.label} className="submenu-item">
                            <NavLink className="submenu-link" to={base + menu.to} permission={menu.permission}>{menu.label}</NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    );
}
