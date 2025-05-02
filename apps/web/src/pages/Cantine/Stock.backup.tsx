/* eslint-disable react-hooks/exhaustive-deps */
import { Block, DangerButton, Input, PageTitle, PrimaryButton, SecondaryButton, Select, Spinner } from 'ui'
import { Flex, Pagination, PrimaryLink } from '@base/components'
import { useApi, useAuthStore } from 'hooks';
import { number_array } from 'functions';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Row } from '@base/components/Bootstrap';

const defaultStock = {
    id: 0,
    date: '',
    label: '',
    type: '',
    quantity: 0
}

export function Stock(): ReactNode {
    const [scholarYearId, setScholarYearId] = useState<string | number>(0)
    const [schoolId, setSchoolId] = useState<number>(0)
    const [foodId, setFoodId] = useState<number>(0)
    const [perPage, setPerPage] = useState(10)
    const [stocksData, setStocksData] = useState<typeof defaultStock[]>([]);

    const { user } = useAuthStore()

    const requestParams = useMemo(() => {
        return {
            school_id: schoolId,
            scholar_year_id: scholarYearId,
            food_id: foodId,
            page: 1,
            paginate: true,
            per_page: perPage
        }
    }, [])

    const { Client: ScholarYearClient, datas: scholarYears, RequestState: ScholarYearRequestState } = useApi<ScholarYear>({
        url: '/scholar-years'
    })

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: FoodClient, datas: foods, RequestState: FoodRequestState } = useApi<Food>({
        url: '/foods'
    })

    const { Client: StockClient, datas: stocks, RequestState: StockRequestState } = useApi<typeof defaultStock>({
        url: '/stocks',
        key: 'data'
    })

    const changeSchoolId = useCallback(({ target }: InputChange) => {
        const value = parseInt(target.value, 10)
        setSchoolId(value)
        requestParams.school_id = value
        getStocks()
    }, [schoolId, setSchoolId])

    const changeScholarYearId = useCallback(({ target }: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.scholar_year_id = value
        setScholarYearId(value)
        getStocks()
    }, [scholarYearId, setScholarYearId])

    const changeFoodId = useCallback(({ target }: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.food_id = value
        setFoodId(value)
        getStocks()
    }, [foodId, setFoodId])

    const changePerPage = useCallback(({ target }: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.per_page = value
        setPerPage(value)
        getStocks()
    }, [perPage, setPerPage])

    const getSchools = async () => {
        const schools = await SchoolClient.get()
        const currentSchool = user?.school ? user.school : schools.at(0)
        if (currentSchool) {
            setSchoolId(currentSchool.id)
            requestParams.school_id = currentSchool.id
        }
    }

    const getScholarYears = async () => {
        const scholarYears = await ScholarYearClient.get()
        const current = scholarYears.at(1)
        if (current) {
            setScholarYearId(current.id)
            requestParams.scholar_year_id = current.id
        }
    }

    const getDatas = async () => {
        await FoodClient.get()
        await getSchools()
        await getScholarYears()
        await getStocks()
    }

    const refreshList = () => getStocks()

    const changePage = useCallback((data: { page: number }) => {
        requestParams.page = data.page
        getStocks()
    }, [requestParams])

    useEffect(() => {
        getDatas()
    }, [])

    /*const deleteStock = async (id: number) => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await ConsoClient.destroy(id)
                        if (response.ok) {
                            toast('Supprime', {
                                closeButton: true,
                                type: 'success',
                                position: config.toastPosition
                            })
                            getDatas()
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error',
                                position: config.toastPosition
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }*/

    const getStocks = async () => {
        const stocks = await StockClient.get()
        const temp = [];

        if (stocks.length > 0) {
            stocks.map(stock => {
                temp.push({
                    date: stock.date,
                    label: stock.label,
                    type: stock.type,
                    quantity: stock.quantity
                })
            })
        } else  {
            temp.push(defaultStock)
        }

        setStocksData([...temp])
    }

    /*const handleInputChange = useCallback(({ target }: InputChange) => {
        const { name, value } = target;
        const [index, key] = name.split("_");

        setStocks(prevConsommations => {
            const updatedConsommations = [...prevConsommations];
            const consommationToUpdate = { ...updatedConsommations[index] };

            consommationToUpdate[`_${key}`] = {
                ...consommationToUpdate[`_${key}`],
                value: value,
            };

            updatedConsommations[index] = consommationToUpdate;
            return updatedConsommations;
        });
    }, [])*/

    const add = () => {
        setStocksData([...stocksData, { ...defaultStock }])
    }

    const remove = (mainKey: number) => {
        const fields = stocksData.filter((_value, key) => {
            return key !== mainKey
        })
        setStocksData([...fields])
    }

    return (
        <>
            <PageTitle title="Fiche de stock">
                <Flex alignItems='center' justifyContent='between'>
                    <SecondaryButton
                        loading={StockRequestState.loading}
                        onClick={refreshList}
                        icon="arrow-clockwise"
                        className='me-2'
                    >
                        Recharger
                    </SecondaryButton>
                    <PrimaryLink icon="plus" to="/cantine/consommation/add">
                        Fiche de stock
                    </PrimaryLink>
                </Flex>
            </PageTitle>

            <Block className='mb-3'>
                <h6 className='text-info fw-bold text-center'>Filtre des resultats</h6>
                <hr />
                <Row>
                    <Col n={3} className="mb-3">
                        <Select
                            controlled
                            value={schoolId}
                            options={schools}
                            label="Établissement"
                            onChange={changeSchoolId}
                            placeholder="Tous les etablissement"
                            loading={SchoolRequestState.loading}
                            config={{ optionKey: 'id', valueKey: 'name' }}
                        />
                    </Col>
                    <Col n={3} className="mb-3">
                        <Select
                            controlled
                            value={scholarYearId}
                            options={scholarYears}
                            label="Annee scolaire"
                            onChange={changeScholarYearId}
                            loading={ScholarYearRequestState.loading}
                        />
                    </Col>
                    <Col n={3} className="mb-3">
                        <Select
                            controlled
                            value={foodId}
                            options={foods}
                            label="Collation"
                            onChange={changeFoodId}
                            placeholder="Tous les collations"
                            loading={FoodRequestState.loading}
                        />
                    </Col>
                    <Col n={3} className='mb-3'>
                        <Select
                            label="Elements"
                            placeholder={null}
                            value={perPage}
                            options={number_array(100, 10)}
                            onChange={changePerPage}
                            controlled
                        />
                    </Col>
                </Row>
            </Block>

            {StockRequestState.loading && <Spinner isBorder className='text-center text-primary' size='sm' />}

            <Block>
                <h3 className='text-primary mb-3'>Entree en Stock</h3>

                <Row>
                    <Col n={6} className="mb-3">
                        <Select
                            controlled
                            value={schoolId}
                            options={schools}
                            label="Établissement"
                            onChange={changeSchoolId}
                            placeholder="Selectionner un etablissement"
                            loading={SchoolRequestState.loading}
                            config={{ optionKey: 'id', valueKey: 'name' }}
                        />
                    </Col>
                    <Col n={6} className="mb-3">
                        <Select
                            controlled
                            value={foodId}
                            options={foods}
                            label="Collation"
                            onChange={changeFoodId}
                            placeholder="Selectionner une collation"
                            loading={FoodRequestState.loading}
                        />
                    </Col>
                </Row>

                <div className="table-responsive mb-4">
                    <table className="table table-striped table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className='bg-primary text-white'>#</th>
                                <th className='bg-primary text-white'>Date</th>
                                <th className='bg-primary text-white'>Libelle</th>
                                <th className='bg-primary text-white'>Quantite</th>
                                <th className='bg-primary text-white'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocksData.map((stockData, index) => <tr key={index}>
                                <td className='align-middle'>{index + 1}</td>
                                <td className='align-middle'><Input value={stockData.date} type='date' /></td>
                                <td className='align-middle'><Input value={stockData.label} /></td>
                                <td className='align-middle'><Input value={stockData.quantity} type='number'inputMode='numeric' /></td>
                                <td className='align-middle'>
                                    {index === 0 && <PrimaryButton icon="plus-lg" className='me-2 p-2' onClick={add} />}
                                    {index > 0 && <DangerButton icon="dash-lg" className='p-2' onClick={() => remove(index)} />}
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>

                <PrimaryButton onClick={add} icon='plus-lg'>Ajouter une ligne</PrimaryButton>
            </Block>

            {stocks.meta && stocks.meta.total > 0 && stocks.meta.last_page > 1 && (
                <Pagination changePage={changePage} data={stocks} />
            )}
        </>
    )
}
