import generatePDF, { Margin, Options, Resolution } from 'react-to-pdf';

export function usePdf() {

    const exportToPdf = (ref: React.MutableRefObject<undefined>, options: Options) => {
        generatePDF(ref, {
            resolution: Resolution.HIGH,
            method: 'save',
            page: {
                margin: Margin.SMALL,
                format: 'A4',
                orientation: 'portrait'
            },
            ...options
        })
    }

    return {
        exportToPdf
    }
}