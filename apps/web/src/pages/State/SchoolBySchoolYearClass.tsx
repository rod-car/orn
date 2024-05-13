/* eslint-disable react/jsx-key */
import { useApi } from 'hooks'
import { config, getToken } from '../../config'
import { useCallback, useEffect } from 'react'
import { Block, Button, Spinner } from 'ui'
import { getPdf } from '@renderer/utils'

export function SchoolBySchoolYearClass(): JSX.Element {
    const { Client, RequestState, error, datas } = useApi<Student>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students',
        key: 'data'
    })

    const getData = useCallback(async () => {
        await Client.get({}, '/state/school-class')
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const headers = datas.headers
    const realData = datas.data

    const exportPdf = useCallback(async (className = 'custom', scholar_year = '') => {
        let fileName = 'Etat_etudiant_ecole_classe_annee_scolaire'
        if (scholar_year !== '') fileName = fileName + '_' + scholar_year

        getPdf({ fileName: `${fileName}.pdf`, className: className, title: 'États des étudiants' })
    }, [])

    return (
        <Block>
            <div className="mb-5 d-flex align-items-center justify-content-between">
                <h2>Etudiant par ecole, par classe et par annee scolaire</h2>
                <Button
                    onClick={(): Promise<void> => exportPdf('school-class-student-state')}
                    icon="print"
                    className="btn secondary-link"
                >
                    Exporter tous vers PDF
                </Button>
            </div>
            {error && <div className="alert alert-danger">{error.message}</div>}

            {RequestState.loading && <Spinner />}

            {realData &&
                Object.keys(realData).map((scholar_year) => {
                    const data = realData[scholar_year]
                    return (
                        <div key={scholar_year}>
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <h4 className="text-muted m-0">Annee scolaire: {scholar_year}</h4>
                                <Button
                                    onClick={(): Promise<void> =>
                                        exportPdf(
                                            `school-class-student-state-${scholar_year}`,
                                            scholar_year
                                        )
                                    }
                                    icon="print"
                                    mode="info"
                                >
                                    Exporter vers PDF
                                </Button>
                            </div>

                            <div
                                className={`global-state school-class-student-state school-class-student-state-${scholar_year}`}
                            >
                                <p className="d-none h4 mb-4">
                                    Étudiant par école, par classe et par année scolaire:{' '}
                                    {scholar_year}
                                </p>
                                <table className={`table table-striped table-bordered`}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {headers &&
                                                Object.values(headers).map((header) => (
                                                    <th>{header}</th>
                                                ))}
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(data).map((school) => (
                                            <tr>
                                                <td>{school}</td>
                                                {Object.values(headers).map((classe) => (
                                                    <td className="text-primary">
                                                        {data[school][classe] ?? (
                                                            <span className="text-danger">0</span>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="fw-bold">{data[school].total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}
        </Block>
    )
}
