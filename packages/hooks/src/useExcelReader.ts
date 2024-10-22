import { useCallback, useState } from 'react';
import * as xlsx from 'xlsx'

export function useExcelReader() {
    const [json, setJson] = useState<OneSheet | MultiSheet>([])
    const [sheets, setSheets] = useState<string[]>([])
    const [importing, setImporting] = useState<boolean>(false)
    const [parsing, setParsing] = useState<boolean>(false)
    const [exporting, setExporting] = useState<boolean>(false)

    const getSheets = useCallback(async (target: HTMLInputElement): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            setParsing(true);

            if (target.files) {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    try {
                        const data = e.target?.result;
                        const workbook = xlsx.read(data, { type: "array" });
                        const sheetNames = workbook.SheetNames;

                        setSheets(sheetNames);
                        resolve(sheetNames);
                        setParsing(false);
                    } catch (error) {
                        reject(error);
                        setParsing(false);
                    }
                };

                reader.onerror = () => {
                    setParsing(false);
                    reject(new Error("Failed to read the file."));
                };

                reader.readAsArrayBuffer(target.files[0]);
            } else {
                setParsing(false);
                reject(new Error("No files selected."));
            }
        });
    }, []);

    const toJSON = useCallback((target: HTMLInputElement, sheet?: string, needAll: boolean = false): Promise<OneSheet | MultiSheet> => {
        return new Promise((resolve, reject) => {
            setImporting(true);

            if (target.files) {
                const reader = new FileReader();

                reader.onload = (e: ProgressEvent<FileReader>) => {
                    try {
                        const data = e.target?.result;
                        const workbook = xlsx.read(data, { type: "array", cellDates: true });
                        const sheetNames = workbook.SheetNames;

                        let sheetName = '';
                        let json: OneSheet | MultiSheet = {}

                        if (needAll) {
                            const sheetsData: MultiSheet = {};

                            sheetNames.forEach((sheetName) => {
                                const worksheet = workbook.Sheets[sheetName];
                                sheetsData[sheetName] = xlsx.utils.sheet_to_json(worksheet) as OneSheet;
                            });

                            json = sheetsData
                        } else {
                            if (sheet && sheetNames.includes(sheet)) sheetName = sheet;
                            else sheetName = sheetNames[0];

                            const worksheet = workbook.Sheets[sheetName];
                            json = xlsx.utils.sheet_to_json(worksheet) as OneSheet;
                        }

                        setJson(json);
                        resolve(json);
                        setImporting(false);
                    } catch (error) {
                        reject(error);
                        setImporting(false);
                    }
                };

                reader.onerror = () => {
                    setImporting(false);
                    reject(new Error("Failed to read the file."));
                };
    
                reader.readAsArrayBuffer(target.files[0]);
            } else {
                setImporting(false);
                reject(new Error("No files selected."));
            }
        });
    }, []);

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
        exporting,
        parsing,
        sheets,
        getSheets
    };
}
