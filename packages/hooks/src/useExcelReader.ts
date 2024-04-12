import { useState } from 'react';
import * as xlsx from 'xlsx'

export function useExcelReader() {
    const [json, setJson] = useState<Object[]>([])
    const [importing, setImporting] = useState<boolean>(false)
    const [exporting, setExporting] = useState<boolean>(false)

    const toJSON = (target: HTMLInputElement) => {
        setImporting(true)

        if (target.files) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const data = e.target?.result;
                const workbook = xlsx.read(data, { type: "array", cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                setJson(json as Object[])
                setImporting(false)
            };
            reader.readAsArrayBuffer(target.files[0]);
        }
    }

    const toExcel = (data: unknown[][], fileName: string = "File.xlsx") => {
        setExporting(true)

        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.aoa_to_sheet(data)

        xlsx.utils.book_append_sheet(wb, ws, 'Feuille 1')
        xlsx.writeFile(wb, fileName)

        setExporting(false)
    }

    const resetJSON = () => {
        setJson([])
    }

    return {
        json,
        toJSON,
        importing,
        resetJSON,
        toExcel,
        exporting
    };
}
