import { ReactNode } from "react";
import { Link as RouterDomLink, LinkProps as RouterFomLinkProps } from 'react-router-dom';
import './Link.modules.scss';

type LinkProps = RouterFomLinkProps & {
    icon?: string;
    can?: boolean;
}

export function Link({ to, can = true, ...props }: LinkProps): ReactNode {
    return <>{can ? <RouterDomLink to={to} style={{ fontSize: 'small' }} {...props}>
        {props.icon && <i className={`bi bi-${props.icon} me-2`}></i>}
        {props.children}
    </RouterDomLink> : undefined}</>
}

export function PrimaryLink(props: LinkProps): ReactNode {
    return <Link {...props} className={`btn btn-primary shadow ${props.className}`} />
}

export function InfoLink(props: LinkProps): ReactNode {
    return <Link {...props} className={`btn btn-info shadow text-white ${props.className}`} />
}

export function EditLink(props: LinkProps): ReactNode {
    return <Link {...props} className="btn-sm me-2 btn btn-primary shadow">
        <i className="bi bi-pencil-square"></i>
        {props.children && <span className="ms-2">{props.children}</span>}
    </Link>
}

export function DetailLink(props: LinkProps): ReactNode {
    return <Link {...props} className="btn-sm me-2 btn btn-info text-white">
        <i className="bi bi-folder"></i>
    </Link>
}