import { ReactNode } from "react";

export function PageTitle ({title, children} : { title: string, children: ReactNode }) {
    return <>
        <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0 text-gray-800">{title}</h1>
            {children}
        </div>
        <hr className="mb-5" />
    </>
}