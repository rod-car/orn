import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import logo from '@renderer/assets/logo.png'

export function Header(): ReactNode {
    return <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
        <img className="w-15 me-3" src={logo} alt="Logo" />
        <span style={{ color: '#071E78', fontFamily: 'arial' }}>ORN</span>
    </NavLink>
}