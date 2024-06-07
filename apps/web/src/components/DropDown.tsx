import { NavLink } from "react-router-dom"

export function DropDown({
    id,
    items,
    label,
    base,
    icon
}: {
    id: string
    label: string
    base: string
    icon: string
    items: Array<{ url: string; label: string; icon?: string }>
}): JSX.Element {
    return (
        <li className="nav-item dropdown">
            <a
                className="nav-link dropdown-toggle"
                id={id}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {icon && <span className={`fa fa-${icon} me-2`}></span>}
                {label}
            </a>
            <ul className="dropdown-menu" aria-labelledby={id}>
                {items.map((item) => (
                    <li key={item.url}>
                        <NavLink className="dropdown-item" to={base + item.url}>
                            {item.icon && <i className={`fa fa-${item.icon} me-2`}></i>}
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </li>
    )
}