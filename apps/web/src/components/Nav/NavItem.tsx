import { ReactNode } from "react";
import './Nav.css';

type NavItemProps = {
    to: string;
    label: string;
    icon?: string;
    active?: boolean;
}

export function NavItem({ to, label, icon, active = false }: NavItemProps): ReactNode {
    return <li className="nav-item">
        <a className={`nav-link ${active ? 'active' : ''}`} href={to}>
            {icon && <span className="nav-icon">
                <i className={`fa fa-${icon}`}></i>
            </span>}
            <span className="nav-link-text">{label}</span>
        </a>
    </li>
}