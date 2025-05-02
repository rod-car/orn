import { PropsWithChildren, ReactNode } from "react";
import { Spinner } from "ui";

type ExcelExportButtonProps = PropsWithChildren & {
    ExportClient: unknown;
    url: string;
    requestData?: Record<string, unknown>;
    elements: {label: string, params: Record<string, unknown>}[];
    loading?: boolean;
    can?: boolean;
}

export function ExcelExportButton(
    {ExportClient, url, requestData, elements, loading, children, can = true}: ExcelExportButtonProps
): ReactNode {
    async function exportExcel(params: Record<string, unknown>) {
        const response = await ExportClient.post({...requestData, ...params}, url)
        const filePath = response.data;
        if (filePath) {
            window.open(filePath as unknown as string, '_blank')
        }
    }

    return <>
        {can ? <div className="dropdown me-2">
            <button
                style={{ fontSize: 'small' }}
                disabled={loading}
                className="btn btn-warning dropdown-toggle d-flex align-items-center shadow p-2"
                type="button"
                id="printDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {loading
                    ? <Spinner className="d-inline me-2" size="sm" isBorder={true} />
                    : <div className="d-inline me-2"><i className="bi bi-printer-fill"></i></div>}
                {children}
            </button>
            <ul style={{ fontSize: 'small' }} className="dropdown-menu" aria-labelledby="printDropdown">
                {elements.map(element => <li key={element.label}>
                    <a onClick={(e) => { e.preventDefault(); return exportExcel(element.params)}} className="dropdown-item" href="#">{element.label}</a>
                </li>)}
            </ul>
        </div> : undefined}
    </>
}
