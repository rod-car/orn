import { ReactNode } from "react";
import './HomeCard.modules.scss'

export function HomeCard({
    title, icon, value, type = "primary"
}: {
    title: ReactNode, icon: string, value: ReactNode | unknown, type: ElementMode
}): ReactNode {
    return <>
        <div className="card card-stats mb-4 mb-xl-0 shadow">
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <h5 className="card-title text-uppercase text-muted mb-0">
                            {title}
                        </h5>
                        <span className="h2 font-weight-bold mb-0">
                            {value as ReactNode}
                        </span>
                    </div>
                    <div className="col-auto">
                        <div className={`icon icon-shape bg-${type} text-white rounded-circle shadow`}>
                            <i className={`bi bi-${icon}`}></i>
                        </div>
                    </div>
                </div>
                <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success me-2"></span>
                    <span className="text-nowrap"></span>
                </p>
            </div>
        </div>
    </>
}