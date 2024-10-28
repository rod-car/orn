import { ReactNode } from "react";

export function PageTitle ({title, children} : { title: ReactNode, children?: ReactNode }) {
    return <>
        <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 text-primary">{title}</h4>
            {children}
        </div>
        <hr className="mb-4 text-primary" />
    </>
}