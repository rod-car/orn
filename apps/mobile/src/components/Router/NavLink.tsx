import { useAuthStore } from "hooks";
import { ReactNode } from "react";
import { NavLink as RouterDomNavLink, NavLinkProps } from 'react-router-dom';

export function NavLink(props: NavLinkProps & { permission?: string | string[] }): ReactNode {
    const { isAllowed } = useAuthStore();

    return isAllowed(props.permission) && <RouterDomNavLink {...props} />
}