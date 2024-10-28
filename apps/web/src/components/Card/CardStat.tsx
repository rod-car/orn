import { ReactNode } from "react";
import { Link } from '@base/components'

type CardStateProps = {
    title: string;
    value: ReactNode;
    link?: string;
    evolution?: {
        type: string;
        value: number;
    } 
}

export function CardState({ title, value, link = "#", evolution }: CardStateProps): ReactNode {
    return <div className="app-card app-card-stat shadow-sm h-100">
        <div className="app-card-body p-3 p-lg-4">
            <h4 className="stats-type mb-1">{title}</h4>
            <div className="stats-figure">{value}</div>
            {evolution?.value && <div className="stats-meta text-success">
                <i className="bi bi-arrow-up me-1"></i>
                {evolution?.value}
            </div>}
        </div>
        <Link className="app-card-link-mask" to={link}></Link>
    </div>
}