import {ReactNode} from "react";

export function Z({value, normal}: {value: number, normal: [number, number]}): ReactNode {
    const badgeColor = (value < normal[0] || value > normal[1]) ? 'danger' : 'success'
    return <div className="d-inline">
        {value !== null ? <span className={`badge bg-${badgeColor}`}>
            {value}
        </span> : "N/A"}
    </div>
}