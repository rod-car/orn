import { ReactNode } from 'react'
import { Link as RRDLink, LinkProps } from 'react-router-dom'
import './Link.modules.scss'

export function Link({ className, ...props }: LinkProps): ReactNode {
    return (
        <RRDLink className={`shadow ${className}`} {...props}>
            {props.children}
        </RRDLink>
    )
}
