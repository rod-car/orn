/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { config } from '@base/config'
import { Fragment, ReactNode, useCallback, useEffect } from 'react'
import { range, round } from 'functions'
import Skeleton from 'react-loading-skeleton'
import { ExcelExportButton } from '@base/components/index.ts'

export function StudentBySchoolZ({ surveyId }: { surveyId: number }): ReactNode {
    const { Client, RequestState, error, datas } = useApi<SurveySchoolZ>({
        baseUrl: config.baseUrl,
        url: '/students'
    })

    const { Client: ExportClient, RequestState: ExportRequestState } = useApi<Survey>({
        baseUrl: config.baseUrl,
        url: '/surveys'
    })

    const getData = useCallback(async () => {
        let url = '/state/student-school-z'
        if (surveyId !== undefined) url += '/' + surveyId.toString()
        await Client.get({}, url)
    }, [surveyId])

    useEffect(() => {
        getData()
    }, [surveyId])

    const headers = datas.headers as string[]
    const realData = datas.datas as SurveySchoolZ[]

    const types = ['Global', 'Modéré', 'Sévère']

    return (
        <>
            {error && <div className="alert alert-danger">{error.message}</div>}

            {RequestState.loading && <LoadingComponent />}

            {realData && realData.length === 0 && <p className="text-center fw-bold">Aucune données</p>}

            {realData && Object.keys(realData).map((surveyDetails: string) => {
                const data = realData[surveyDetails]
                const parts = surveyDetails.split("/") as [string, string, string]

                return (
                    <div key={parts[0]} className="mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h6 className="text-primary fw-bold m-0">Phase {parts[1]} pour l'année {parts[2]}</h6>
                            <ExcelExportButton
                                ExportClient={ExportClient}
                                loading={ExportRequestState.creating}
                                url={`/${parts[0]}/global-to-excel`}
                                elements={[
                                    {label: "Excel CSV", params: {type: 'csv'}},
                                    {label: "Excel XLSX", params: {type: 'xlsx'}}
                                ]}
                            >Exporter ces résultats</ExcelExportButton>
                        </div>
                        <div className="table-responsive" style={{ border: '1px solid silver' }}>
                            <table className="table table-striped table-bordered text-sm">
                                <thead>
                                    <tr className="text-nowrap">
                                        <th></th>
                                        {headers &&
                                            headers.map((header: string) => (
                                                <th key={header}>
                                                    <span className="vertical-text">
                                                        {header}
                                                    </span>
                                                </th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-nowrap">Nombre d'élève</td>
                                        <Td headers={headers} keyOne="T" schoolZ={data} />
                                    </tr>
                                    <tr>
                                        <td
                                            className="text-uppercase fw-bold"
                                            colSpan={headers.length + 1}
                                        >
                                            Mal nutrition aigüe
                                        </td>
                                    </tr>
                                    {types.map((type) => (
                                        <tr key={type}>
                                            <td className="text-nowrap text-uppercase">
                                                {type} {type === 'Global' ? '(M + S)' : ''}
                                            </td>
                                            <Td
                                                headers={headers}
                                                keyOne="MA"
                                                keyTwo={type}
                                                schoolZ={data}
                                            />
                                        </tr>
                                    ))}

                                    <tr>
                                        <td className="text-uppercase fw-bold" colSpan={headers.length + 1}>
                                            Insuffisance pondérale
                                        </td>
                                    </tr>
                                    {types.map((type) => (
                                        <tr key={type}>
                                            <td className="text-nowrap text-uppercase">
                                                {type} {type === 'Global' ? '(M + S)' : ''}
                                            </td>
                                            <Td
                                                headers={headers}
                                                keyOne="IP"
                                                keyTwo={type}
                                                schoolZ={data}
                                            />
                                        </tr>
                                    ))}

                                    <tr>
                                        <td className="text-uppercase fw-bold" colSpan={headers.length + 1}>
                                            Malnutrition Chronique
                                        </td>
                                    </tr>
                                    {types.map((type) => (
                                        <tr key={type}>
                                            <td className="text-nowrap text-uppercase">
                                                {type} {type === 'Global' ? '(M + S)' : ''}
                                            </td>
                                            <Td
                                                headers={headers}
                                                keyOne="CH"
                                                keyTwo={type}
                                                schoolZ={data}
                                            />
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })}
        </>
    )
}


/**
 * Skeleton de chargement
 * @returns 
 */
function LoadingComponent(): ReactNode {
    const headers = range(10)
    const types = range(3)
    return <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
            <Skeleton style={{height: 30, width: 300}} />
            <Skeleton style={{height: 30, width: 300}} />
        </div>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th className="w-25"></th>
                    {headers.map(header => <th key={header}>
                        <span className="vertical-text">
                            <Skeleton direction="rtl" style={{height: 150, width: '30px'}} />
                        </span>
                    </th>)}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Skeleton style={{height: 30}} />
                    </td>
                    {headers.map(header => <td key={header}>
                        <Skeleton style={{height: 30}} />
                    </td>)}
                </tr>
                {types.map(index => <Fragment key={index}>
                    <tr>
                        <td colSpan={headers.length + 1}><Skeleton style={{height: 30}} /></td>
                    </tr>
                    {types.map(type => <tr key={type}>
                        <td><Skeleton style={{height: 30}} /></td>
                        {headers.map(header => <td key={header}>
                            <Skeleton style={{height: 30}} />
                        </td>)}
                    </tr>)}
                </Fragment>)}
            </tbody>
        </table>
    </div>
}

type TdProps = {
    headers: string[]
    keyOne: string
    keyTwo?: string
    schoolZ: SchoolZ
}

const Td = ({ headers, keyOne, keyTwo, schoolZ }: TdProps): ReactNode => {
    return (
        <>
            {headers.map((school: string) => {
                const schoolZSchool = schoolZ[school]
                const schoolTab = schoolZSchool ? schoolZSchool[keyOne] : null

                return (
                    <td key={school}>
                        {schoolTab !== null && typeof schoolTab === 'object' ? (
                            <span className={school === 'TOTAL' ? 'fw-bold' : 'fw-bold'}>
                                {schoolTab[keyTwo]['value']} {keyTwo === 'Global' ? '/' + schoolZSchool['T'] : ''} {' '}
                                {schoolTab[keyTwo]['value'] > 0 && school !== 'TOTAL' && (
                                    <span className="text-primary fw-normal">
                                        <br />
                                        {`(${round(schoolTab[keyTwo]['percent'])}%)`}
                                    </span>
                                )}
                                {keyTwo === 'Global' && school === 'TOTAL' && <span className="text-primary fw-normal">
                                    <br />
                                    ({round(schoolTab[keyTwo]['value'] / schoolZSchool['T'] * 100, 2)}%)
                                </span>}
                            </span>
                        ) : (school === 'TOTAL' ? (
                            <span className="fw-bold">{schoolTab}</span>
                        ) : (
                            schoolTab ?? "-"
                        ))}
                    </td>
                )
            })}
        </>
    )
}
