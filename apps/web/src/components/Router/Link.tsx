import { ReactNode } from "react";
import { Link as RouterDomLink, LinkProps } from 'react-router-dom';

export function Link(props: LinkProps): ReactNode {
    return <RouterDomLink {...props} />
}