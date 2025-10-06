import { PropsWithChildren, ReactNode } from "react";
import { Link } from "@base/components/Router";

type BasicCardProps = PropsWithChildren & {
    title: ReactNode;
    body?: ReactNode;
    icon?: string;
    actionLink?: string;
    actionLabel?: ReactNode;
}

export function BasicCard({title, body, icon, actionLabel = "Click me", actionLink = "#", ...props}: BasicCardProps): ReactNode {
    return <div className="app-card app-card-basic d-flex flex-column align-items-start shadow-sm">
        <div className="app-card-header p-3 border-bottom-0">
            <div className="row align-items-center gx-2">
                <div className="col-auto">
                    {icon && <div className="app-icon-holder">
                        <i className={`bi bi-${icon}`}></i>
                    </div>}
                </div>
                <div className="col-auto">
                    <h5 className="app-card-title">{title}</h5>
                </div>
            </div>
        </div>
        <div className="app-card-body px-4">
            <div className="intro">{body ? body : props.children}</div>
        </div>
        {typeof actionLabel === 'object' ? <div className="app-card-footer p-4 mt-auto">{actionLabel}</div> : (actionLink && <div className="app-card-footer p-4 mt-auto">
            <Link permission="justificative.show" className="btn app-btn-secondary" to={actionLink}>{actionLabel}</Link>
        </div>)}
    </div>
}