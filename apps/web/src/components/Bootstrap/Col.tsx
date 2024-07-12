import { HTMLProps, ReactNode } from "react";

export function Col({n = 12, sm, md, lg, xl, xxl, children}: {n?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number} & HTMLProps<HTMLDivElement>): ReactNode {
    return <div className={`col-${n} col-sm-${sm ? sm : n} col-md-${md ? md : n} col-lg-${lg ? lg : n} col-xl-${xl ? xl : n} col-xxl-${xxl ? xxl : n}`}>
        {children}
    </div>
}