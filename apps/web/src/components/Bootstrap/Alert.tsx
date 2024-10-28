import { PropsWithChildren, ReactNode } from "react";

type AlertProps = PropsWithChildren & {
    dismissible?: boolean;
    type?: 'danger' | 'success' | 'info' | 'warning' | 'primary' | 'secondary' | 'default';
}

export function Alert({children, dismissible = false, type = 'primary'}: AlertProps): ReactNode {
    return <div className={`alert alert-${type} ${dismissible && 'alert-dismissible'} shadow-sm`} role="alert">
        {children}
        {dismissible && <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>}
    </div>
}

export function AlertDanger({children}: PropsWithChildren): ReactNode {
    return <Alert type="danger">{children}</Alert>
}