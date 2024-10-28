/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { config } from '@base/config'
import { ReactNode, useCallback, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { range } from 'functions'
import { ExcelExportButton } from '@base/components/ExportExcelButton.tsx'

export function StudentBySchoolZValue({surveyId}: {surveyId?: number}): ReactNode {
    const { Client, RequestState, error, datas } = useApi<SurveySchoolZ>({
        baseUrl: config.baseUrl,
        url: '/students'
    })

    const { Client: ExportClient, RequestState: ExportRequestState } = useApi<Survey>({
        baseUrl: config.baseUrl,
        url: '/surveys'
    })

    const getData = useCallback(async () => {
        let url = '/state/student-school-z-value'
        if (surveyId !== undefined) url += '/' + surveyId.toString()

        await Client.get({
            regenerate: true
        }, url)
    }, [surveyId])

    useEffect(() => {
        getData()
    }, [surveyId])

    const schoolsName = datas.headers as Record<string, string>
    const realData = datas.datas as SurveySchoolZ[]

    return <>
        {error && <div className="alert alert-danger">{error.message}</div>}

        {RequestState.loading && <LoadingComponent />}

        {realData &&
            Object.keys(realData).map((surveyDetails: string) => {
                const data = realData[surveyDetails]
                const parts = surveyDetails.split("/") as [string, string, string]

                return <div key={parts[0]}>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h6 className="text-primary fw-bold m-0">Phase {parts[1]} pour l'année {parts[2]}</h6>
                        <ExcelExportButton
                            ExportClient={ExportClient}
                            loading={ExportRequestState.creating}
                            url={`/${parts[0]}/metrics-to-excel`}
                            elements={[
                                {label: "Excel CSV", params: {type: 'csv'}},
                                {label: "Excel XLSX", params: {type: 'xlsx'}}
                            ]}
                        >Exporter ces résultats</ExcelExportButton>
                    </div>
                    <hr />

                    <div className="table-responsive">
                        {Object.keys(data).map((abaqueName, index) => {
                            const datas = data[abaqueName]
                            const headers = Object.keys(datas).sort((a, b) => parseFloat(a) - parseFloat(b))

                            return <div key={index} className='mb-3'>
                                <h6 className="mb-3 fw-bold">{abaqueName}</h6>
                                <table className="table table-striped table-bordered text-sm">
                                    <thead>
                                        <tr className="text-nowrap">
                                            <th></th>
                                            {headers.map((header, index) => <th key={index}>{header}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schoolsName && Object.values(schoolsName).map((schoolName: string) => <tr key={schoolName}>
                                            <td>{schoolName}</td>
                                            {headers.map((header, index) => <td key={index} className={header === 'TOTAL' ? 'fw-bold' : ''}>
                                                {JSON.stringify(datas[header][schoolName])}
                                            </td>)}
                                        </tr>)}
                                        <tr>
                                            <td>TAUX</td>
                                            {headers.map((header, index) => <td key={index}>{datas[header]['TAUX GENERALE']} %</td>)}
                                        </tr>
                                    </tbody>
                                </table>
                                <hr />
                            </div>
                        })}
                    </div>
                </div>
        })}
    </>
}


/**
 * Composant de chargement
 * 
 * @returns
 */
function LoadingComponent(): ReactNode {
    const headers = [1, 2, 3, 4, 5, 6, 7, 8]
    const schools = range(10)
    return <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
            <Skeleton style={{height: 30, width: 250}} />
            <Skeleton style={{height: 30, width: 250}} />
        </div>
        <div className='mb-5'>
            <h5 className="mb-4 fw-bold"><Skeleton style={{height: 30, width: 300}} /></h5>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr className="text-nowrap">
                        <th className="w-25"></th>
                        {headers.map(header => <th key={header}><Skeleton style={{height: 30}} /></th>)}
                    </tr>
                </thead>
                <tbody>
                    {schools.map(schoolName => <tr key={schoolName}>
                        <td><Skeleton style={{height: 30}} /></td>
                        {headers.map(header => <td key={header}><Skeleton style={{height: 30}} /></td>)}
                    </tr>)}
                    <tr>
                        <td><Skeleton style={{height: 30}} /></td>
                        {headers.map(header => <td key={header}><Skeleton style={{height: 30}} /></td>)}
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}