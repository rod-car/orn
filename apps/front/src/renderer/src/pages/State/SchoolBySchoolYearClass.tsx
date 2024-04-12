import { useApi } from 'hooks'
import { config } from '../../../config'
import { useCallback, useEffect } from 'react'
import { Button, Spinner } from 'ui'

export function SchoolBySchoolYearClass(): JSX.Element {
    const { Client, RequestState, error, datas } = useApi<Student>({
        baseUrl: config.baseUrl,
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

    return (
        <>
            <h1 className="mb-5">Etudiant par ecole, par classe et par annee scolaire</h1>
            {error && <div className="alert alert-danger">{error.message}</div>}

            {RequestState.loading && <Spinner />}

            {realData &&
                Object.keys(realData).map((scholar_year) => {
                    const data = realData[scholar_year]
                    return (
                        <div key={scholar_year}>
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <h4 className="text-muted m-0">Annee scolaire: {scholar_year}</h4>
                                <Button icon="print" mode="info">
                                    Imprimer
                                </Button>
                            </div>
                            <table className="table table-striped table-bordered">
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
                    )
                })}
        </>
    )
}
