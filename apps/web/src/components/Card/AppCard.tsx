import { ReactNode } from "react";

type AppCardProps = {
    title: string;
    content: string;
    icon?: string;
    actionLabel?: string;
    actionUrl?: string;
}

export function AppCard({title, content, icon, actionLabel, actionUrl}: AppCardProps): ReactNode {
    return <div className="app-card alert alert-dismissible shadow-sm mb-4 border-left-decoration" role="alert">
        <div className="inner">
            <div className="app-card-body p-3 p-lg-4">
                <h3 className="mb-3">{title}</h3>
                <div className="row gx-5 gy-3">
                    <div className="col-12 col-lg-9">
                        <div>{content}</div>
                    </div>
                    <div className="col-12 col-lg-3">
                        {(actionLabel || icon) && <a className="btn app-btn-primary" href={actionUrl}>
                            {icon && <i className={`bi bi-${icon} me-2`}></i>}
                            {actionLabel}
                        </a>}
                    </div>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    </div>
}