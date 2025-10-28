import { PropsWithChildren, ReactNode } from "react";
import { PrimaryLink } from "@base/components";

type BasicCardProps = PropsWithChildren & {
    title: ReactNode;
    body?: ReactNode;
    icon?: string;
    actionLink?: string;
    actionLabel?: ReactNode;
}

export function BasicCard({title, body, icon, actionLabel = "Click me", actionLink = "#", ...props}: BasicCardProps): ReactNode {
    return <div className="app-card app-card-basic d-flex flex-column align-items-center shadow-sm">
        <div className="app-card-header p-3 border-bottom-0">
            <div className="d-flex align-items-center gap-2">
                {icon && (
                    <div className="app-icon-holder d-flex align-items-center justify-content-center p-0">
                        <i className={`bi bi-${icon}`}></i>
                    </div>
                )}
                <h5 className="app-card-title mb-0">{title}</h5>
            </div>
        </div>
        <div className="app-card-body px-4">
            <div className="intro">{body ? body : props.children}</div>
        </div>
        {typeof actionLabel === 'object' ? <div className="app-card-footer p-4 mt-auto">{actionLabel}</div> : (actionLink && <div className="app-card-footer p-4 mt-auto">
            <PrimaryLink icon="eye" permission="justificative.show" to={actionLink}>{actionLabel}</PrimaryLink>
        </div>)}
    </div>
}