import { PropsWithChildren, ReactNode } from "react"
import { Link } from "react-router-dom"

type CardStateProps = PropsWithChildren & {
    title: string
    value: ReactNode
    link?: string
    evolution?: {
        value: string | number
    }
    icon?: ReactNode // Nouvelle propriété optionnelle
}

export function CardState({
    title,
    value,
    link = "#",
    evolution,
    icon
}: CardStateProps): ReactNode {
    return (
        <div className="app-card app-card-stat shadow-sm h-100">
            <div className="app-card-body p-3 p-lg-4">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h4 className="stats-type mb-0">{title}</h4>
                    {icon && <div className="stats-icon">{icon}</div>}
                </div>
                <div className="stats-figure">{value}</div>
                {evolution?.value && (
                    <div className="stats-meta text-success">
                        <i className="bi bi-arrow-up me-1"></i>
                        {evolution?.value}
                    </div>
                )}
            </div>
            <Link className="app-card-link-mask" to={link}></Link>
        </div>
    )
}