/* eslint-disable react/no-unescaped-entities */
import { useApi } from 'hooks'
import { config } from '../../../config'
import { ReactNode, useCallback, useEffect } from 'react'
import { Button, Spinner } from 'ui'
import { round } from 'functions'

export function StudentBySchoolZ(): ReactNode {
    const { Client, RequestState, error, datas } = useApi<SurveySchoolZ>({
        baseUrl: config.baseUrl,
        url: '/students'
    })

    const getData = useCallback(async () => {
        await Client.get({}, '/state/student-school-z')
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const headers = datas.headers as string[]
    const realData = datas.datas as SurveySchoolZ[]

    return (
        <>
            <h1 className="mb-5">Etat de la mal nutrition</h1>
            {error && <div className="alert alert-danger">{error.message}</div>}

            {RequestState.loading && <Spinner />}

            {realData &&
                Object.keys(realData).map((survey_id) => {
                    const data = realData[survey_id]
                    const types = { G: 'Global', M: 'Modéré', S: 'Sévère' }

                    return (
                        <div key={survey_id} className="mb-5">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h4 className="text-muted m-0">Enquête N°: {survey_id}</h4>
                                <Button icon="print" mode="info">
                                    Imprimer
                                </Button>
                            </div>
                            <div
                                className="table-responsive"
                                style={{ border: '1px solid silver' }}
                            >
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr className="text-nowrap">
                                            <th></th>
                                            {headers &&
                                                headers.map((header: string) => (
                                                    <th key={header}>{header}</th>
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
                                                Mal nutrition
                                            </td>
                                        </tr>
                                        {Object.keys(types).map((key) => (
                                            <tr key={key}>
                                                <td className="text-nowrap text-uppercase">
                                                    {types[key]}
                                                </td>
                                                <Td
                                                    headers={headers}
                                                    keyOne="MA"
                                                    keyTwo={key}
                                                    schoolZ={data}
                                                />
                                            </tr>
                                        ))}

                                        <tr>
                                            <td
                                                className="text-uppercase fw-bold"
                                                colSpan={headers.length + 1}
                                            >
                                                Insuffisance pondérale
                                            </td>
                                        </tr>
                                        {Object.keys(types).map((key) => (
                                            <tr key={key}>
                                                <td className="text-nowrap text-uppercase">
                                                    {types[key]}
                                                </td>
                                                <Td
                                                    headers={headers}
                                                    keyOne="IP"
                                                    keyTwo={key}
                                                    schoolZ={data}
                                                />
                                            </tr>
                                        ))}

                                        <tr>
                                            <td
                                                className="text-uppercase fw-bold"
                                                colSpan={headers.length + 1}
                                            >
                                                Chronique
                                            </td>
                                        </tr>
                                        {Object.keys(types).map((key) => (
                                            <tr key={key}>
                                                <td className="text-nowrap text-uppercase">
                                                    {types[key]}
                                                </td>
                                                <Td
                                                    headers={headers}
                                                    keyOne="CH"
                                                    keyTwo={key}
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

const Td = ({
    headers,
    keyOne,
    keyTwo,
    schoolZ
}: {
    headers: string[]
    keyOne: string
    keyTwo?: string
    schoolZ: SchoolZ
}): ReactNode => {
    return (
        <>
            {headers.map((school: string) => {
                const schoolTab = schoolZ[school][keyOne]
                return (
                    <td key={school}>
                        {typeof schoolTab === 'object' ? (
                            <span className={school === 'TOTAL' ? 'fw-bold' : ''}>
                                {schoolTab[keyTwo]['value']}{' '}
                                {schoolTab[keyTwo]['value'] > 0 && school !== 'TOTAL' && (
                                    <span className="text-primary">{`(${round(
                                        schoolTab[keyTwo]['percent']
                                    )}%)`}</span>
                                )}
                            </span>
                        ) : school === 'TOTAL' ? (
                            <span className="fw-bold">{schoolTab}</span>
                        ) : (
                            schoolTab
                        )}
                    </td>
                )
            })}
        </>
    )
}
