import { ReactNode, useId } from "react";
import './Nav.css';

type DropDownProps = {
    label: string;
    icon?: string;
    menus: {label: string, to: string}[];
}

export function DropDown({ label, menus, icon }: DropDownProps): ReactNode {
    const id = useId()

    return <li className="nav-item has-submenu">
        <a className="nav-link submenu-toggle" href="#" data-bs-toggle="collapse" data-bs-target={`#${id}`} aria-expanded="false" aria-controls={id}>
            {icon && <span className="nav-icon">
                <i className={`fa fa-${icon}`}></i>
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
                {menus.map(menu => <li key={menu.label} className="submenu-item"><a className="submenu-link" href={menu.to}>{menu.label}</a></li>)}
            </ul>
        </div>
    </li>
}