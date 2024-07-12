/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { config } from '@base/config'
import { useCallback, useEffect } from 'react'
import { Block, Button, Spinner } from 'ui'

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

    const headers = datas.headers as string[]
    const realData = datas.data

    return (
        <Block>
            <div className="mb-5 d-flex align-items-center justify-content-between">
                <h2 className="text-primary fw-semibold">Repartition des étudiants par année scolaire</h2>
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
                                            {headers && Object.values(headers).map(header => <th key={header}>{header}</th>)}
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(data).map((school) => (
                                            <tr key={school}>
                                                <td>{school}</td>
                                                {Object.values(headers).map(classe => <td key={classe as string} className="text-primary">
                                                    {data[school][classe] ?? (
                                                        <span className="text-danger">0</span>
                                                    )}
                                                </td>)}
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
