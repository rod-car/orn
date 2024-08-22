import { ReactNode } from "react";
import { NavLink as RouterDomNavLink, NavLinkProps } from 'react-router-dom';

export function NavLink(props: NavLinkProps): ReactNode {
    return <RouterDomNavLink {...props} />
}