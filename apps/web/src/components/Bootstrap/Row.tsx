import { HTMLProps, ReactNode } from "react";

export function Row({className, ...props}: HTMLProps<HTMLDivElement>): ReactNode {
    return <div className={`row ${className}`} {...props}>
        {props.children}
    </div>
}