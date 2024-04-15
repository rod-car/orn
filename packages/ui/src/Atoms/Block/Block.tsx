import { ReactNode } from "react"

export const Block = ({ children, className }: { children: ReactNode, className?: string }): ReactNode => {
    return (<div className={`rounded shadow-lg p-4 ${className}`}>{children}</div>)
}
