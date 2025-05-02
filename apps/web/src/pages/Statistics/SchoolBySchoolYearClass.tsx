/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect } from 'react'
import { Block, Spinner } from 'ui'

export function SchoolBySchoolYearClass(): ReactNode {
    const { Client, RequestState, error, datas } = useApi<Student>({
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
        <>
            {error && <div className="alert alert-danger">{error.message}</div>}
            {RequestState.loading && <Spinner className='text-center' isBorder size="sm" />}
            {realData &&
                Object.keys(realData).reverse().map((scholar_year) => {
                    const data = realData[scholar_year]
                    return (
                        <Block key={scholar_year} className='mb-4'>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h6 className="text-info m-0">Année scolaire: {scholar_year}</h6>
                            </div>
                            <table className="table table-striped table-bordered text-sm">
                                <thead>
                                    <tr>
                                        <th className='bg-primary text-white'></th>
                                        {headers && Object.values(headers).map(header => <th className='bg-primary text-white text-end' key={header}>{header}</th>)}
                                        <th className='bg-primary text-white text-end'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(data).map((school) => (
                                        <tr key={school}>
                                            <td className={`text-white fw-bold ${school === 'TOTAUX_GENERALE' ? 'bg-primary' : 'bg-info'}`}>{school}</td>
                                            {Object.values(headers).map(classe => <td key={classe} className={`text-primary text-end ${school === 'TOTAUX_GENERALE' && 'fw-bold text-white bg-primary'}`}>
                                                {data[school][classe] ?? <span className="text-danger">-</span>}
                                            </td>)}
                                            <td className={`fw-bold text-white text-end ${school === 'TOTAUX_GENERALE' ? 'bg-primary' : 'bg-info'}`}>{data[school].total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Block>
                    )
                })}
        </>
    )
}
