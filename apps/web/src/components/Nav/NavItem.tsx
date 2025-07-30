import { ReactNode } from "react";
import { Link } from "@base/components"
import './Nav.css';
import { useAuthStore } from "hooks";

type NavItemProps = {
    to: string;
    label: string;
    icon?: string;
    active?: boolean;
    permission?: string | string[];
}

export function NavItem({ to, label, icon, active = false, ...props }: NavItemProps): ReactNode {
    const { isAllowed } = useAuthStore();
    const authorized = props.permission && isAllowed(props.permission)

    return authorized ? <li className="nav-item">
        <Link permission={props.permission} className={`nav-link ${active === true ? 'active' : ''}`} to={to}>
            {icon && <span className="h6 nav-icon">
                <i className={`bi bi-${icon}`}></i>
            </span>}
            <span className="nav-link-text">{label}</span>
        </Link>
    </li> : undefined
}