import { useApi } from 'hooks'
import { config, getToken } from '@renderer/config'
import { ReactNode, useCallback, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { range } from 'functions'
import { ExcelExportButton } from '@renderer/components/ExportExcelButton.tsx'

export function StudentBySchoolZValue({scholarYear, surveyId}: {scholarYear: string, surveyId?: number}): ReactNode {
    const { Client, RequestState, error, datas } = useApi<SurveySchoolZ>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students'
    })

    const { Client: ExportClient, RequestState: ExportRequestState } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/surveys'
    })

    const getData = useCallback(async () => {
        let url = '/state/student-school-z-value'
        if (surveyId !== undefined) url += '/' + surveyId.toString()

        await Client.get({
            scholar_year: scholarYear,
            regenerate: true
        }, url)
    }, [surveyId])

    useEffect(() => {
        getData()
    }, [surveyId])

    const schoolsName = datas.headers
    const realData = datas.datas as SurveySchoolZ[]

    return <>
        {error && <div className="alert alert-danger">{error.message}</div>}

        {RequestState.loading && <LoadingComponent />}

        {realData &&
            Object.keys(realData).map(survey_id => {
                const data = realData[survey_id]

                return <div key={survey_id} className="mb-5">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h4 className="text-primary fw-bold m-0">Phase: {survey_id}</h4>
                        <ExcelExportButton
                            ExportClient={ExportClient}
                            loading={ExportRequestState.creating}
                            url={`/${survey_id}/metrics-to-excel`}
                            elements={[
                                {label: "Excel CSV", params: {type: 'csv'}},
                                {label: "Excel XLSX", params: {type: 'xlsx'}}
                            ]}
                        >Exporter ces résultats</ExcelExportButton>
                    </div>
                    <hr />

                    <div className="table-responsive">
                        {Object.keys(data).map(abaqueName => {
                            const datas = data[abaqueName]
                            const headers = Object.keys(datas).sort((a, b) => parseFloat(a) - parseFloat(b))

                            return <div key={abaqueName} className='mb-5'>
                                <h5 className="mb-4 fw-bold">{abaqueName}</h5>
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr className="text-nowrap">
                                            <th></th>
                                            {headers.map(header => <th key={header}>{header}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schoolsName && schoolsName.map(schoolName => <tr key={schoolName}>
                                            <td>{schoolName}</td>
                                            {headers.map(header => <td key={header} className={header === 'TOTAL' ? 'fw-bold' : ''}>
                                                {datas[header][schoolName]}
                                            </td>)}
                                        </tr>)}
                                        <tr>
                                            <td>TAUX</td>
                                            {headers.map(header => <td key={header}>{datas[header]['TAUX GENERALE']} %</td>)}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>})}
                    </div>
                </div>
        })}
    </>
}

function LoadingComponent(): ReactNode {
    const headers = [1, 2, 3, 4, 5, 6, 2, 3]
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