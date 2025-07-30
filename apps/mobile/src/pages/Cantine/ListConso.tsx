/* eslint-disable react-hooks/exhaustive-deps */
import { Block, Button, DangerButton, Input, PageTitle, PrimaryButton, SecondaryButton, Select, Spinner } from 'ui'
import { EditLink, Flex, Pagination, PrimaryLink } from '@base/components'
import { useApi, useAuthStore } from 'hooks';
import { format } from 'functions';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Col } from '@base/components/Bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { config } from '@base/config/index.ts';

export function ListConso(): ReactNode {
    const [scholarYearId, setScholarYearId] = useState<string | number>(0)
    const [schoolId, setSchoolId] = useState<number>(0)
    const [foodId, setFoodId] = useState<number>(0)
    const [perPage, setPerPage] = useState(5) // Réduit pour une meilleure vue sur tablette
    const [isFilterExpanded, setIsFilterExpanded] = useState(true)
    const [selectedConsommation, setSelectedConsommation] = useState(null)

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentDetail, setCurrentDetail] = useState(null);
    const [currentConsommation, setCurrentConsommation] = useState(null);
    const [editForm, setEditForm] = useState({
        date: '',
        old_date: '',
        teachers: 0,
        cookers: 0,
        others: 0,
        quantity: 0,
        unit: '',
        classes: []
    });

    const { Client: ConsoClient, RequestState: ConsoRequestState, datas: consommations } = useApi<Record<string, unknown>>({ url: '/consommations' })
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

    const openEditModal = (consommation, detail) => {
        setCurrentConsommation(consommation);
        setCurrentDetail(detail);
        setEditForm({
            date: detail.date,
            old_date: detail.date,
            teachers: detail.teachers,
            cookers: detail.cookers,
            others: detail.others,
            quantity: detail.quantity,
            unit: detail.unit,
            classes: detail.details_classes.map(cls => ({
                id: cls.id,
                name: cls.name,
                quantity: cls.quantity
            }))
        });
        setShowEditModal(true);
    };

    const handleFormChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleClassQuantityChange = (name, newQuantity) => {
        setEditForm(prev => ({
            ...prev,
            classes: prev.classes.map(cls =>
                cls.name === name ? { ...cls, quantity: parseInt(newQuantity, 10) } : cls
            )
        }));
    };

    const saveChanges = async () => {
        try {
            const consommationId = currentConsommation?.id;
            const response = await ConsoClient.patch(consommationId, editForm, {
                single_date: 1
            })

            if (response.ok) {
                toast('Modification enregistrée', {
                    type: 'success',
                    position: config.toastPosition
                });
                setShowEditModal(false);
                getConso();
            } else {
                const message = response?.response?.data?.message ?? "Une erreur s'est produite. Verifier les donnees.";
                toast(message, {
                    type: 'error',
                    position: config.toastPosition
                });
            }
        } catch (error) {
            toast('Erreur lors de la modification', {
                type: 'error',
                position: config.toastPosition
            });
        }
    };

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

    const changeSchoolId = ({ target }: InputChange) => {
        const value = parseInt(target.value, 10)
        setSchoolId(value)
        requestParams.school_id = value
        getConso()
    }

    const changeScholarYearId = ({ target }: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.scholar_year_id = value
        setScholarYearId(value)
        getConso()
    }

    const changeFoodId = ({ target }: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.food_id = value
        setFoodId(value)
        getConso()
    }

    const changePerPage = ({ target }: InputChange) => {
        const value = parseInt(target.value, 10)
        requestParams.per_page = value
        setPerPage(value)
        getConso()
    }

    const getConso = () => ConsoClient.get(requestParams)

    const getSchools = async () => {
        if (user?.school) {
            setSchoolId(user.school.id)
            requestParams.school_id = user.school.id
        }

        const schools = await SchoolClient.get()
        const currentSchool = schools.at(0)
        if (currentSchool && !requestParams.school_id) {
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

    function deleteConsoDate(date: string, id: number) {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer cet enregistrement ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await ConsoClient.destroy(id, { date: date })
                        if (response.ok) {
                            toast('Supprimé', {
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

    function deleteConso(id: number) {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ce consommation ?',
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

    const toggleDetails = (consommation: Record<string, unknown>) => {
        if (selectedConsommation && selectedConsommation.id === consommation.id) {
            setSelectedConsommation(null)
        } else {
            setSelectedConsommation(consommation)
        }
    }

    const toggleFilters = () => {
        setIsFilterExpanded(!isFilterExpanded)
    }

    return (
        <>
            <PageTitle title="Historique des consommations">
                <Flex alignItems='center' justifyContent='between'>
                    <SecondaryButton
                        loading={ConsoRequestState.loading}
                        onClick={refreshList}
                        icon="arrow-clockwise"
                        className='me-2'
                    >
                        Recharger
                    </SecondaryButton>
                    <PrimaryLink permission="consommation.create" icon="plus-lg" to="/cantine/consommation/add">
                        Ajouter une consommation
                    </PrimaryLink>
                </Flex>
            </PageTitle>

            <Block className='mb-3'>
                <button
                    className='btn btn-outline-primary w-100 mb-3'
                    onClick={toggleFilters}
                >
                    {isFilterExpanded ? 'Masquer les filtres' : 'Afficher les filtres'}
                    <i className={`bi bi-chevron-${isFilterExpanded ? 'up' : 'down'} ms-2`}></i>
                </button>

                {isFilterExpanded && (
                    <div className='row mb-0'>
                        <Col n={3} md={6} sm={6} className="mb-3">
                            <Select
                                controlled
                                value={schoolId}
                                options={schools}
                                label="Établissement"
                                onChange={changeSchoolId}
                                placeholder="Tous les établissement"
                                loading={SchoolRequestState.loading}
                                config={{ optionKey: 'id', valueKey: 'name' }}
                            />
                        </Col>
                        <Col n={3} md={6} sm={6} className="mb-3">
                            <Select
                                controlled
                                value={scholarYearId}
                                options={scholarYears}
                                label="Année scolaire"
                                onChange={changeScholarYearId}
                                loading={ScholarYearRequestState.loading}
                            />
                        </Col>
                        <Col n={3} md={6} sm={6} className="mb-3">
                            <Select
                                controlled
                                value={foodId}
                                options={foods}
                                label="Collation"
                                onChange={changeFoodId}
                                placeholder="Toutes les collations"
                                loading={FoodRequestState.loading}
                            />
                        </Col>
                        <Col n={3} md={6} sm={6} className='mb-3'>
                            <Select
                                label="Éléments par page"
                                placeholder={null}
                                value={perPage}
                                options={[5, 10, 20, 50]}
                                onChange={changePerPage}
                                controlled
                            />
                        </Col>
                    </div>
                )}
            </Block>

            {ConsoRequestState.loading && <Spinner isBorder className='text-center text-primary' size='lg' />}
            {!ConsoRequestState.loading && consommations.data && consommations.data.length <= 0 &&
                <div className='alert alert-warning text-center'>
                    <i className='bi bi-exclamation-triangle me-2'></i>
                    Aucune donnée disponible
                </div>
            }

            {consommations.data && consommations.data.map((consommation, index) => (
                <Block key={index} className='mb-4 consommation-card'>
                    <div
                        className='d-flex justify-content-between align-items-center p-3 cursor-pointer'
                        onClick={() => toggleDetails(consommation)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div>
                            <h5 className='fw-bold text-primary mb-1'>{consommation.food} - {consommation.school}</h5>
                            <div className='text-muted small'>{consommation.scholar_year}</div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                            <span className='badge bg-primary mb-1'>Total: {consommation.total}</span>
                            <i className={`bi bi-chevron-${selectedConsommation && selectedConsommation.id === consommation.id ? 'up' : 'down'}`}></i>
                        </div>
                    </div>

                    {selectedConsommation && selectedConsommation.id === consommation.id && (
                        <div className='px-3'>
                            {consommation.details && consommation.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className='card mb-4'>
                                    <div className='card-header bg-light d-flex justify-content-between align-items-center'>
                                        <strong>{format(detail.date)}</strong>
                                        <span className='badge bg-danger'>Quantite consomme: {detail.quantity} {consommation.unit}</span>
                                    </div>
                                    <div className='card-body p-3'>
                                        <div className='row'>
                                            <div className='col-10'>
                                                <h6 className='mb-3 text-primary'>Classes:</h6>
                                                <div className='d-flex flex-wrap gap-2 mb-3'>
                                                    {detail.details_classes.map((detail_class, k) => (
                                                        <span key={k} className='badge bg-light text-primary border border-primary'>
                                                            {detail_class.name}: {detail_class.quantity}
                                                        </span>
                                                    ))}
                                                </div>

                                                <h6 className='mb-3 text-primary'>Autres:</h6>
                                                <div className='d-flex flex-wrap gap-2'>
                                                    <span className='badge bg-info text-white border border-info'>
                                                        ENSEIGNANT: {detail.teachers}
                                                    </span>
                                                    <span className='badge bg-info text-white border border-info'>
                                                        CUISINIER: {detail.cookers}
                                                    </span>
                                                    <span className='badge bg-info text-white border border-info'>
                                                        AUTRES: {detail.others}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='col-2'>
                                                <div className='fw-bold text-center'>Total</div>
                                                <div className='text-primary text-center fw-bold fs-5'>
                                                    {detail.total}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex align-items-center justify-content-end">
                                            <PrimaryButton
                                                permission="consommation.edit"
                                                onClick={() => {
                                                    openEditModal(consommation, { ...detail, unit: consommation.unit });
                                                }}
                                                className='me-3'
                                                size='sm'
                                                icon='pen'
                                            >
                                                Modifier
                                            </PrimaryButton>
                                            <DangerButton
                                                permission="consommation.delete"
                                                onClick={() => deleteConsoDate(detail.date, consommation.id)}
                                                loading={ConsoRequestState.deleting}
                                                size='sm'
                                                icon='trash'
                                            >
                                                Supprimer
                                            </DangerButton>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="d-flex p-3 align-items-center">
                        {!ConsoRequestState.deleting && <EditLink permission="consommation.edit" to={`/cantine/consommation/edit/${consommation.id}`}>Editer ce consommation</EditLink>}
                        <DangerButton permission={["consommation.delete"]} loading={ConsoRequestState.deleting} onClick={() => deleteConso(consommation.id)} icon='trash' className='py-1 px-2 me-2'>Supprimer</DangerButton>
                    </div>
                </Block>
            ))}

            {consommations.meta && consommations.meta.total > 0 && consommations.meta.last_page > 1 && (
                <div className='d-flex justify-content-center mt-3'>
                    <Pagination changePage={changePage} data={consommations} />
                </div>
            )}

            {showEditModal && currentDetail && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
                            <div className="modal-header bg-primary">
                                <h6 className="modal-title text-white">
                                    Modifier la consommation du {format(currentDetail.date)}
                                </h6>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: "80vh", overflowY: 'scroll' }}>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <Input
                                            label="Date"
                                            type="date"
                                            value={editForm.date}
                                            onChange={(e) => handleFormChange('date', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <Input
                                            type="number"
                                            maxLength={9}
                                            inputMode="numeric"
                                            label={`Quantité consommé ${currentDetail.unit ? '(' + currentDetail.unit + ')' : ''}`}
                                            value={editForm.quantity}
                                            onChange={({ target }) => handleFormChange('quantity', target.value ? parseFloat(target.value) : 0)}
                                        />
                                    </div>
                                </div>

                                {editForm.classes.map((cls, index) => <div key={index} className="mb-3">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text text-primary fw-bold w-20">
                                            {cls.name}
                                        </span>
                                        <div className="w-80">
                                            <Input
                                                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                                maxLength={9}
                                                value={cls.quantity}
                                                onChange={({ target }) => handleClassQuantityChange(cls.name, target.value)}
                                                inputMode='numeric'
                                                type='number'
                                            />
                                        </div>
                                    </div>
                                </div>)}

                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text text-primary fw-bold w-20">
                                        Ens
                                    </span>
                                    <div className="w-80">
                                        <Input
                                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                            maxLength={9}
                                            value={editForm.teachers}
                                            onChange={(e) => handleFormChange('teachers', e.target.value ? parseInt(e.target.value, 10) : 0)}
                                            inputMode='numeric'
                                            type='number'
                                        />
                                    </div>
                                </div>

                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text text-primary fw-bold w-20">
                                        Cuis
                                    </span>
                                    <div className="w-80">
                                        <Input
                                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                            maxLength={9}
                                            value={editForm.cookers}
                                            onChange={(e) => handleFormChange('cookers', e.target.value ? parseInt(e.target.value, 10) : 0)}
                                            inputMode='numeric'
                                            type='number'
                                        />
                                    </div>
                                </div>

                                <div className="input-group input-group-sm">
                                    <span className="input-group-text text-primary fw-bold w-20">
                                        Autres
                                    </span>
                                    <div className="w-80">
                                        <Input
                                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                            maxLength={9}
                                            value={editForm.others}
                                            onChange={(e) => handleFormChange('others', e.target.value ? parseInt(e.target.value, 10) : 0)}
                                            inputMode='numeric'
                                            type='number'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <DangerButton
                                    icon='x-lg'
                                    size='sm'
                                    onClick={() => setShowEditModal(false)}
                                    permission="consommation.edit"
                                >
                                    Annuler
                                </DangerButton>
                                <PrimaryButton
                                    icon='save'
                                    size='sm'
                                    permission="consommation.edit"
                                    loading={ConsoRequestState.updating}
                                    onClick={saveChanges}
                                >
                                    Enregistrer
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}