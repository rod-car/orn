/* eslint-disable react/no-unescaped-entities */
import { useApi } from 'hooks'
import { config, getToken } from '@renderer/config'
import { ReactNode, useCallback, useEffect } from 'react'
import { Block, Button, Spinner } from 'ui'
import { getPdf } from '@renderer/utils'

export function StudentBySchoolZValue({scholarYear, surveyId}: {scholarYear: string, surveyId?: number}): ReactNode {
    const { Client, RequestState, error, datas } = useApi<SurveySchoolZ>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students'
    })

    const getData = useCallback(async () => {
        let url = '/state/student-school-z-value'
        if (surveyId !== undefined) url += '/' + surveyId.toString()
        await Client.get({
            scholar_year: scholarYear,
            regenerate: true
        }, url)
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const schoolsName = datas.headers
    const realData = datas.datas as SurveySchoolZ[]

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
        <>
            <div className="d-flex align-items-center justify-content-between mb-5">
                <h2>Statistique par valeur de Z ({scholarYear})</h2>
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
                Object.keys(realData).map(survey_id => {
                    const data = realData[survey_id]

                    return (
                        <Block key={survey_id} className="mb-5">
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

                            <div className={`table-responsive`}>
                                {Object.keys(data).map(abaqueName => {
                                    const datas = data[abaqueName]
                                    const headers = Object.keys(datas).sort((a, b) => parseFloat(a) - parseFloat(b))

                                    return <div key={abaqueName} className='mb-5'><h5 className="mb-4">{abaqueName}</h5>
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
                        </Block>
                    )
                })}
        </>
    )
}