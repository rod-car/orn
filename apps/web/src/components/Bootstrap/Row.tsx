import { HTMLProps, ReactNode } from "react";

export function Row({className, ...props}: HTMLProps<HTMLDivElement>): ReactNode {
    return <div className={`row mb-3 ${className}`} {...props}>
        {props.children}
    </div>
}