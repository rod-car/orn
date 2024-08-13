import { ReactNode } from "react";
import { Link } from "@base/components"
import './Nav.css';

type NavItemProps = {
    to: string;
    label: string;
    icon?: string;
    active?: boolean;
}

export function NavItem({ to, label, icon, active = false }: NavItemProps): ReactNode {
    return <li className="nav-item">
        <Link className={`nav-link ${active === true ? 'active' : ''}`} to={to}>
            {icon && <span className="h6 nav-icon">
                <i className={`bi bi-${icon}`}></i>
            </span>}
            <span className="nav-link-text">{label}</span>
        </Link>
    </li>
}