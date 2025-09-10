import { ReactNode } from "react"

export const Block = ({ children, className, title }: { children: ReactNode, className?: string, title?: string }): ReactNode => {
    return <div className={`shadow-sm app-card p-4 ${className}`}>
        {title && <h5 className="text-primary mb-4">{title}</h5>}
        {children}
    </div>
}
