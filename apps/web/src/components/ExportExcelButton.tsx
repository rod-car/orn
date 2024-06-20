import { PropsWithChildren, ReactNode } from "react";
import { Spinner } from "ui";

export function ExcelExportButton(
    {ExportClient, url, requestData, elements, loading, children}:
    {ExportClient: any, url: string, requestData?: Record<string, unknown>, elements: {label: string, params: Record<string, unknown>}[], loading?: boolean} & PropsWithChildren
): ReactNode {
    async function exportExcel(params: Record<string, unknown>) {
        const response = await ExportClient.post({...requestData, ...params}, url)
        const filePath = response.data;
        if (filePath) {
            window.open(filePath as unknown as string, '_blank')
        }
    }
    return <div className="dropdown me-2">
        <button
            disabled={loading}
            className="btn btn-warning dropdown-toggle d-flex align-items-center"
            type="button"
            id="printDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            {loading
                ? <Spinner className="d-inline me-2" size="sm" isBorder={true} />
                : <div className="d-inline me-2"><i className="fa fa-print"></i></div>}
            {children}
        </button>
        <ul className="dropdown-menu" aria-labelledby="printDropdown">
            {elements.map(element => <li key={element.label}>
                <a onClick={(e) => { e.preventDefault(); return exportExcel(element.params)}} className="dropdown-item" href="#">{element.label}</a>
            </li>)}
        </ul>
    </div>
}
