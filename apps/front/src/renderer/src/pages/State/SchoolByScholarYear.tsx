import { useApi } from 'hooks'
import { config } from '../../../config'
import { useCallback, useEffect } from 'react'
import { Button, Spinner } from 'ui'

export function SchoolByScholarYear(): JSX.Element {
    const { Client, RequestState, error, datas } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students',
        key: 'data'
    })

    const getData = useCallback(async () => {
        await Client.get({}, '/state/school-scholar-year')
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const headers = datas.headers
    const realData = datas.data

    return (
        <>
            <h1 className="mb-5">Etudiant par ecole et par annee scolaire</h1>
            {error && <div className="alert alert-danger">{error.message}</div>}

            {RequestState.loading && <Spinner />}

            <div className="d-flex align-items-center justify-content-between mb-5">
                <h4 className="text-muted m-0">Etat</h4>
                <Button icon="print" mode="info">
                    Imprimer
                </Button>
            </div>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th></th>
                        {headers && Object.values(headers).map((header) => <th>{header}</th>)}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {realData &&
                        Object.keys(realData).map((school) => (
                            <tr key={school}>
                                <td>{school}</td>
                                {Object.values(headers).map((scholar_year) => {
                                    return (
                                        <td
                                            key={realData[school][scholar_year]}
                                            className="text-primary"
                                        >
                                            {realData[school][scholar_year] ?? (
                                                <span className="text-danger">0</span>
                                            )}
                                        </td>
                                    )
                                })}
                                <td className="fw-bold">{realData[school].total}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    )
}
