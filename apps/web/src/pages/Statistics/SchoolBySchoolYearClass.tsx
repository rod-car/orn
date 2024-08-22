/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { config } from '@base/config'
import { useCallback, useEffect } from 'react'
import { Block, Spinner } from 'ui'

export function SchoolBySchoolYearClass(): ReactNode {
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
            <div className="d-flex align-items-center justify-content-between">
                <h5 className="text-primary fw-semibold">Repartition des étudiants</h5>
            </div>
            {error && <div className="alert alert-danger">{error.message}</div>}

            {RequestState.loading && <Spinner />}

            {realData &&
                Object.keys(realData).map((scholar_year) => {
                    const data = realData[scholar_year]
                    return (
                        <div key={scholar_year}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h6 className="text-muted m-0">Annee scolaire: {scholar_year}</h6>
                            </div>
                            <table className="table table-striped table-bordered text-sm">
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
                    )
                })}
        </Block>
    )
}
