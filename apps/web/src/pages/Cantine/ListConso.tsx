import { Block, DangerButton, PageTitle, SecondaryButton, Select, Spinner } from 'ui'
import {EditLink, ExcelExportButton, Flex, Pagination, PrimaryLink} from '@base/components'
import { useApi, useAuthStore } from 'hooks';
import { format, number_array } from 'functions';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Row } from '@base/components/Bootstrap';
import { config } from '@base/config';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

export function ListConso(): ReactNode {
    const [scholarYearId, setScholarYearId] = useState<string|number>(0)
    const [schoolId, setSchoolId] = useState<number>(0)
    const [foodId, setFoodId] = useState<number>(0)
    const [perPage, setPerPage] = useState(10)

    const { isAdmin } = useAuthStore()

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

    const { Client: ConsoClient, RequestState, datas: consommations } = useApi<Record<string, unknown>>({ url: '/consommations' })
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

    const changeSchoolId = useCallback(({target}: InputChange) => {
        const value = parseInt(target.value, 10)
        setSchoolId(value)
        requestParams.school_id = value
        getConso()
    }, [schoolId, setSchoolId])

    const changeScholarYearId = useCallback(({target}: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.scholar_year_id = value
        setScholarYearId(value)
        getConso()
    }, [scholarYearId, setScholarYearId])

    const changeFoodId = useCallback(({target}: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.food_id = value
        setFoodId(value)
        getConso()
    }, [foodId, setFoodId])

    const changePerPage = useCallback(({target}: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.per_page = value
        setPerPage(value)
        getConso()
    }, [perPage, setPerPage])

    const getConso = () => ConsoClient.get(requestParams)
    const getSchools = async () => {
        const schools = await SchoolClient.get()
        const currentSchool = schools.at(0)
        if (currentSchool) {
            setSchoolId(currentSchool.id)
            requestParams.school_id = currentSchool.id
        }
    }

    const getScholarYears = async () => {
        const scholarYears = await ScholarYearClient.get()
        const current = scholarYears.at(0)
        if (current) {
            setScholarYearId(current.id)
            requestParams.scholar_year_id = current.id
        }
    }

    const getDatas = async () => {
        FoodClient.get()

        getSchools()

        getScholarYears()

        getConso()
    }

    const refreshList = () => getConso()

    const changePage = useCallback((data: { page: number }) => {
        requestParams.page = data.page
        getConso()
    }, [requestParams])

    useEffect(() => {
        getDatas()
    }, [])

    function deleteConso(id: number) {
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
    }

    return (
        <>
            <PageTitle title="Historique des consommations">
                <Flex alignItems='center' justifyContent='between'>
                    <SecondaryButton
                        loading={RequestState.loading}
                        onClick={refreshList}
                        icon="arrow-clockwise"
                        className='me-2'
                    >
                        Recharger
                    </SecondaryButton>
                    <PrimaryLink icon="plus" to="/cantine/consommation/add">
                        Ajouter une consommation
                    </PrimaryLink>
                </Flex>
            </PageTitle>

            {JSON.stringify(requestParams)}

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
                            config={{optionKey: 'id', valueKey: 'name'}}
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

            {RequestState.loading && <Spinner isBorder className='text-center text-primary' size='sm' />}
            {!RequestState.loading && consommations.data && consommations.data.length <= 0 && <p className='text-center text-danger'>Aucune donnees</p>}
            {consommations.data && consommations.data.map((consommation, index) => <Block key={index}>
                <Row className='mb-3'>
                    <Col n={4}>
                        <h5 className='fw-bold text-primary'>{consommation.school}</h5>
                    </Col>
                    <Col n={4}>
                        <h5 className='fw-bold text-primary text-center'>{consommation.food}</h5>
                    </Col>
                    <Col n={4}>
                        <h5 className='fw-bold text-primary text-end'>{consommation.scholar_year}</h5>
                    </Col>
                </Row>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className='bg-primary text-white'>#</th>
                                <th className='bg-primary text-white'>Date</th>
                                <th className='bg-primary text-white'>Details</th>
                                <th className='bg-primary text-white text-end'>Enseignant</th>
                                <th className='bg-primary text-white text-end'>Cuisinier</th>
                                <th className='bg-primary text-white text-end'>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consommation.details && consommation.details.map((detail, index) => <tr key={index}>
                                <td>{index + 1}</td>
                                <td className='fw-bold'>{format(detail.date)}</td>
                                <td>
                                    <Row>
                                        {detail.details_classes.map((detail_class, k: number) => <Col className='text-end' n={2} key={k}>
                                            <span className='text-nowrap'><b className='text-primary'>{detail_class.name}:</b> <b>{detail_class.quantity}</b></span>
                                        </Col>)}
                                    </Row>
                                </td>
                                <td className='fw-bold text-end'>{detail.teachers}</td>
                                <td className='fw-bold text-end'>{detail.cookers}</td>
                                <td className='fw-bold text-end'>{detail.total}</td>
                            </tr>)}
                            <tr>
                                <td className='bg-primary text-white fw-bold text-uppercase' colSpan={2}>Total generale</td>
                                <td className='bg-primary text-white fw-bold text-end' colSpan={4}>{consommation.total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="d-flex">
                    {!RequestState.deleting && <EditLink can={isAdmin} to={`/cantine/consommation/edit/${consommation.id}`}>Editer ce consommation</EditLink>}
                    <DangerButton can={isAdmin} loading={RequestState.deleting} onClick={() => deleteConso(consommation.id)} icon='trash' className='py-1 px-2 me-2'>Supprimer</DangerButton>
                    <ExcelExportButton
                        ExportClient={ConsoClient}
                        can={isAdmin}
                        url="/export"
                        loading={RequestState.creating}
                        requestData={requestParams}
                        elements={[
                            { params: { type: 'csv' }, label: "Vers CSV" },
                            { params: { type: 'xlsx' }, label: "Vers XLSX" }
                        ]}
                    >Exporter ce consommation</ExcelExportButton>
                </div>
                <hr className='text-primary bg-primary' />
            </Block>)}

            {consommations.meta && consommations.meta.total > 0 && consommations.meta.last_page > 1 && (
                <Pagination changePage={changePage} data={consommations} />
            )}
        </>
    )
}
