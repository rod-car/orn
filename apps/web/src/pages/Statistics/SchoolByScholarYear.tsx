/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect } from 'react'
import { Block, Spinner } from 'ui'

export function SchoolByScholarYear(): ReactNode {
    const { Client, RequestState, error, datas } = useApi<Student>({
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
        <Block>
            <div className="d-flex align-items-center justify-content-between mb-5">
                <h2>Étudiant par école et par année scolaire</h2>
            </div>
            {error && <div className="alert alert-danger">{error.message}</div>}

            {RequestState.loading && <Spinner />}

            <div className="global-state student-sy-state">
                <p className="d-none h4 mb-4">Étudiant par école et par année scolaire</p>
                <table className={`table table-striped table-bordered`}>
                    <thead>
                        <tr>
                            <th></th>
                            {headers &&
                                Object.values(headers).map((header: string) => (
                                    <th key={header}>{header}</th>
                                ))}
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
            </div>
        </Block>
    )
}
