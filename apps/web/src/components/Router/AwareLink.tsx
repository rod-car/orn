import { ReactNode } from "react";
import { Link as RouterDomLink, LinkProps } from 'react-router-dom';

export function AwareLink(props: LinkProps): ReactNode {
    return <RouterDomLink target="_blank" {...props} />
}