import { ReactNode } from "react";
import { Link as RouterDomLink, LinkProps as RouterFomLinkProps } from 'react-router-dom';
import './Link.modules.scss';

type LinkProps = RouterFomLinkProps & {
    icon?: string;
}

export function Link(props: LinkProps): ReactNode {
    return <RouterDomLink style={{ fontSize: 'small' }} {...props}>
        {props.icon && <i className={`bi bi-${props.icon} me-2`}></i>}
        {props.children}
    </RouterDomLink>
}

export function PrimaryLink(props: LinkProps): ReactNode {
    return <Link {...props} className={`btn btn-primary ${props.className}`} />
}

export function InfoLink(props: LinkProps): ReactNode {
    return <Link {...props} className={`btn btn-info text-white ${props.className}`} />
}

export function EditLink(props: LinkProps): ReactNode {
    return <Link {...props} className="btn-sm me-2 btn btn-primary">
        <i className="bi bi-pencil-square"></i>
    </Link>
}

export function DetailLink(props: LinkProps): ReactNode {
    return <Link {...props} className="btn-sm me-2 btn btn-info text-white">
        <i className="bi bi-folder"></i>
    </Link>
}