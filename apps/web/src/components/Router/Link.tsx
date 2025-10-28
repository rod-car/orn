import { ReactNode } from "react";
import { Link as RouterDomLink, LinkProps as RouterFomLinkProps } from 'react-router-dom';
import './Link.modules.scss';
import { useAuthStore } from "hooks";

type LinkProps = RouterFomLinkProps & {
    icon?: string;
    permission?: string | string[];
}

export function Link({ to, permission = [], ...props }: LinkProps): ReactNode {
    const { isAllowed } = useAuthStore()
    return isAllowed(permission) && <RouterDomLink to={to} style={{ fontSize: 'small' }} {...props}>
        {props.icon && <i className={`bi bi-${props.icon} ${props.children ? 'me-2' : ''}`}></i>}
        {props.children}
    </RouterDomLink>
}

export function PrimaryLink(props: LinkProps): ReactNode {
    return <Link {...props} className={`btn btn-primary shadow ${props.className}`} />
}

export function InfoLink(props: LinkProps): ReactNode {
    return <Link {...props} className={`btn btn-info shadow text-white ${props.className}`} />
}

export function EditLink(props: LinkProps): ReactNode {
    return <Link {...props} className="btn-sm me-2 btn btn-primary shadow">
        <i className="bi bi-pencil"></i>
        {props.children && <span className="ms-2">{props.children}</span>}
    </Link>
}

export function DetailLink(props: LinkProps): ReactNode {
    return <Link {...props} className="btn-sm me-2 btn btn-info text-white">
        <i className="bi bi-folder"></i>
    </Link>
}