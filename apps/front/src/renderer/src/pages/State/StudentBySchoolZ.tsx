/* eslint-disable react/no-unescaped-entities */
import { useApi } from 'hooks'
import { config, getToken } from '../../../config'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { Block, Button, Spinner } from 'ui'
import { round } from 'functions'
import { getPdf } from '@renderer/utils'

export function StudentBySchoolZ(): ReactNode {
    const { Client, RequestState, error, datas } = useApi<SurveySchoolZ>({
        baseUrl: config.baseUrl,
        token: getToken(),
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

    const stateRef = useRef()
    const exportPdf = useCallback(async (className = 'custom', phase = 0) => {
        let fileName = 'Etat_mal_nutrition'
        if (phase > 0) fileName = fileName + '_phase_' + phase.toString()

        getPdf({
            fileName: `${fileName}.pdf`,
            className: className,
            title: 'État de la malnutrition'
        })
    }, [])

    return (
        <Block>
            <div className="d-flex align-items-center justify-content-between mb-5">
                <h2>État de la mal nutrition</h2>
                <Button
                    onClick={(): Promise<void> => exportPdf('malnutrition-state')}
                    icon="file"
                    className="btn secondary-link"
                >
                    Exporter tous vers PDF
                </Button>
            </div>

            {error && <div className="alert alert-danger">{error.message}</div>}

            {RequestState.loading && <Spinner />}

            {realData &&
                Object.keys(realData).map((survey_id) => {
                    const data = realData[survey_id]
                    const types = ['Global', 'Modéré', 'Sévère']

                    return (
                        <div key={survey_id} className="mb-5">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h4 className="text-muted m-0">Mésure phase N°: {survey_id}</h4>
                                <Button
                                    onClick={(): Promise<void> =>
                                        exportPdf(`state-phase-${survey_id}`, parseInt(survey_id))
                                    }
                                    icon="print"
                                    mode="info"
                                >
                                    Exporter vers PDF
                                </Button>
                            </div>
                            <div
                                className={`table-responsive`}
                                style={{ border: '1px solid silver', fontSize: '10pt' }}
                            >
                                <div
                                    className={`state-phase-${survey_id} malnutrition-state global-state`}
                                >
                                    <p className="d-none mb-4 h4">Mésure phase N°: {survey_id}</p>

                                    <table
                                        ref={stateRef}
                                        className="table table-striped table-bordered"
                                    >
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
                                                    Mal nutrition
                                                </td>
                                            </tr>
                                            {types.map((type) => (
                                                <tr key={type}>
                                                    <td className="text-nowrap text-uppercase">
                                                        {type}
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
                                                <td
                                                    className="text-uppercase fw-bold"
                                                    colSpan={headers.length + 1}
                                                >
                                                    Insuffisance pondérale
                                                </td>
                                            </tr>
                                            {types.map((type) => (
                                                <tr key={type}>
                                                    <td className="text-nowrap text-uppercase">
                                                        {type}
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
                                                <td
                                                    className="text-uppercase fw-bold"
                                                    colSpan={headers.length + 1}
                                                >
                                                    Chronique
                                                </td>
                                            </tr>
                                            {types.map((type) => (
                                                <tr key={type}>
                                                    <td className="text-nowrap text-uppercase">
                                                        {type}
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
                        </div>
                    )
                })}
        </Block>
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
                            <span className={school === 'TOTAL' ? 'fw-bold' : 'fw-bold'}>
                                {schoolTab[keyTwo]['value']}{' '}
                                {schoolTab[keyTwo]['value'] > 0 && school !== 'TOTAL' && (
                                    <span className="text-primary fw-normal">
                                        <br />
                                        {`(${round(schoolTab[keyTwo]['percent'])}%)`}
                                    </span>
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
