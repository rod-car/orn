import { ReactNode } from "react";

type BasicCardProps = {
    title: string;
    body: string;
    icon?: string;
    actionLink?: string;
    actionLabel?: string;
}

export function BasicCard({title, body, icon, actionLabel = "Click me", actionLink = "#"}: BasicCardProps): ReactNode {
    return <div className="app-card app-card-basic d-flex flex-column align-items-start shadow-sm">
        <div className="app-card-header p-3 border-bottom-0">
            <div className="row align-items-center gx-3">
                <div className="col-auto">
                    {icon && <div className="app-icon-holder">
                        <i className={`fa fa-${icon}`}></i>
                    </div>}
                </div>
                <div className="col-auto">
                    <h4 className="app-card-title">{title}</h4>
                </div>
            </div>
        </div>
        <div className="app-card-body px-4">
            <div className="intro">{body}</div>
        </div>
        {actionLabel && actionLink && <div className="app-card-footer p-4 mt-auto">
            <a className="btn app-btn-secondary" href={actionLink}>{actionLabel}</a>
        </div>}
    </div>
}