import generatePDF, { Margin } from 'react-to-pdf';

export function usePdf() {

    const exportToPdf = (ref: React.MutableRefObject<undefined>, fileName: string) => {
        const options = {
            page: {
                margin: Margin.SMALL,
                format: 'A4',
                orientation: 'portrait',
            }
        };
        
        generatePDF(ref, { ...options, filename: fileName })
    }

    return {
        exportToPdf
    }
}