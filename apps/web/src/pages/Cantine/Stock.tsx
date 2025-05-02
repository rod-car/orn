/* eslint-disable react-hooks/exhaustive-deps */
import { format, scholar_years } from 'functions';
import { useApi, useAuthStore } from 'hooks'
import { Col } from '@base/components/Bootstrap'
import { Block, Input, PageTitle, PrimaryButton, Select, Spinner } from 'ui'
import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

export function Stock(): ReactNode {
    const [school, setSchool] = useState<number | undefined>();
    const [collation, setCollation] = useState<number | undefined>();
    const [unit, setUnit] = useState<string>();
    const [scholarYear, setScholarYear] = useState<string>(scholar_years().at(0) as string);

    const { Client: StockClient, datas: stocks, RequestState: StockRequestState } = useApi<Stock>({
        url: '/stocks',
        key: 'data'
    })

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: FoodClient, datas: foods, RequestState: FoodRequestState } = useApi<Food>({
        url: '/foods'
    })

    const requestParams = useMemo(() => {
        return {
            school_id: school,
            food_id: collation,
            scholar_year: scholarYear
        }
    }, [school, collation, scholarYear])

    const { user } = useAuthStore()

    const getDatas = async () => {
        if (user?.school) {
            setSchool(user.school.id)
            requestParams.school_id = user.school.id
        } else {
            const schools = await SchoolClient.get()
            requestParams.school_id = schools.at(0)?.id;
            setSchool(schools.at(0)?.id)
        }

        const foods = await FoodClient.get()
        requestParams.food_id = foods.at(0)?.id;
        setCollation(foods.at(0)?.id)
        setUnit(foods.at(0)?.unit)

        getStocks()
    }

    const getStocks = useCallback(async () => {
        await StockClient.get(requestParams)
    }, [])

    const changeCollation = useCallback(({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(target.value, 10)
        const selectedCollaction = foods.filter(food => food.id === value).at(0)
        if (selectedCollaction) {
            requestParams.food_id = selectedCollaction.id
            setUnit(selectedCollaction.unit)

            getStocks()
        }

        setCollation(value)
    }, [foods])

    const changeSchool = useCallback(({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(target.value, 10)
        requestParams.school_id = value
        setSchool(value)
        getStocks()
    }, [schools])

    const changeScholarYear = useCallback(({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = target.value
        requestParams.scholar_year = value
        setScholarYear(value)
        getStocks()
    }, [])

    useEffect(() => {
        getDatas()
    }, [])

    return (
        <>
            <PageTitle title="Fiche de Stock">
                <PrimaryButton icon='arrow-clockwise' loading={StockRequestState.loading} onClick={getStocks}>Recharger</PrimaryButton>
            </PageTitle>

            <Block>
                <div className='row'>
                    <Col n={4}>
                        {user?.school ? <Input label='Établissement' auto disabled defaultValue={user.school.name} /> : <Select
                            label="Établissement"
                            options={schools}
                            config={{ optionKey: 'id', valueKey: 'name' }}
                            loading={SchoolRequestState.loading}
                            value={school}
                            onChange={changeSchool}
                            controlled
                        />}
                    </Col>
                    <Col n={4}>
                        <Select
                            label="Année scolaire"
                            value={scholarYear}
                            options={scholar_years()}
                            onChange={changeScholarYear}
                            placeholder={null}
                            controlled
                        />
                    </Col>

                    <Col n={4}>
                        <Select
                            label="Collation"
                            options={foods}
                            config={{ optionKey: 'id', valueKey: 'label' }}
                            loading={FoodRequestState.loading}
                            value={collation}
                            onChange={changeCollation}
                            controlled
                        />
                    </Col>
                </div>
            </Block>

            <Block className="mt-3">
                {StockRequestState.loading && <Spinner isBorder className='text-center text-primary' />}
                {!StockRequestState.loading && stocks.length === 0 && <span className='text-danger text-center'>Aucune donnees</span>}
                {stocks.map((stockItem, idx) => (
                    <div className="card mb-4" key={idx}>
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <span><strong>{stockItem.food_name}</strong> - {stockItem.school_name}</span>
                            <PrimaryButton size='sm' icon='printer'>Imprimer</PrimaryButton>
                        </div>
                        <div className="card-body p-0">
                            <table className="table table-bordered table-striped m-0">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Date</th>
                                        <th>Mouvement</th>
                                        <th>Libelle</th>
                                        <th className='text-end'>Quantité ({unit})</th>
                                        <th className='text-end'>Stock actuel ({unit})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="table-info">
                                        <td colSpan={4}><strong>Stock initial</strong></td>
                                        <td className='text-end'><strong>{stockItem.initial_stock}</strong></td>
                                    </tr>
                                    {stockItem.movements.map((movement, mIndex) => (
                                        <tr key={mIndex}>
                                            <td>{format(movement.date, "dd-MM-y")}</td>
                                            <td><i className={`me-3 fa fa-arrow-${movement.type === 'e' ? 'up' : 'down'} text-${movement.type === 'e' ? 'success' : 'danger'}`}></i><span>{movement.type === 'e' ? 'Entrée' : 'Sortie'}</span></td>
                                            <td>{movement.label || '-'}</td>
                                            <td className='text-end'>{movement.quantity}</td>
                                            <td className='text-end'>{movement.stock_at_date}</td>
                                        </tr>
                                    ))}
                                    <tr className="table-warning">
                                        <td colSpan={4}><strong>Stock final</strong></td>
                                        <td className='text-end'><strong>{stockItem.final_stock}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </Block>
        </>
    )
}