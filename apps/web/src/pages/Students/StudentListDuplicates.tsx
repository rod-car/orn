/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { DetailLink, PrimaryLink } from '@base/components'
import { Block, DangerButton, PageTitle, SecondaryButton, Select } from 'ui'
import { ChangeEvent, memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from '@base/ui';
import { format, range } from 'functions'
import Skeleton from 'react-loading-skeleton'

type DuplicateGroup = {
    firstname: string;
    lastname: string | null;
    birth_date: string | null;
    total: number;
    ids: string;
    main_id: number;
}

type DuplicateResponse = {
    duplicate_groups: DuplicateGroup[];
    total_groups: number;
    total_duplicates: number;
}

/**
 * Page de gestion des doublons d'étudiants
 * @returns ReactNode
 */
export function StudentListDuplicates(): ReactNode {
    const [school, setSchool] = useState(0)
    const [scholarYear, setScholarYear] = useState<string | number>(4)

    const { Client: DuplicateClient, RequestState: DRequestState, error: Derror, datas: duplicates } = useApi<DuplicateResponse>({
        url: '/students/duplicates',
        key: 'data'
    })

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: ScholarYearClient, datas: scholarYears, RequestState: ScholarYearRequestState } = useApi<Survey>({
        url: 'scholar-years'
    })

    const { Client: StudentClient } = useApi<Student>({
        url: '/students',
        key: 'data'
    })

    const requestData = useMemo(() => {
        return {
            school_id: school,
            scholar_year: scholarYear
        }
    }, [school, scholarYear])

    const getDatas = useCallback(() => {
        DuplicateClient.get(requestData, '/check')
    }, [requestData])

    const { user, isAllowed } = useAuthStore()

    useEffect(() => {
        if (user?.school) {
            requestData.school_id = user.school.id
            setSchool(user.school.id)
        }
        SchoolClient.get()
        ScholarYearClient.get()
        getDatas()
    }, [])

    /**
     * Traiter la suppression d'un étudiant
     * @param id 
     */
    const handleDelete = useCallback(async (id: number) => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer cet étudiant ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await StudentClient.destroy(id, {scholar_year_id: scholarYear})
                        if (response.ok) {
                            toast('Supprimé', {
                                closeButton: true,
                                type: 'success'
                            })
                            getDatas()
                        } else {
                            toast('Erreur de suppression', {
                                closeButton: true,
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error'
                        })
                }
            ]
        })
    }, [scholarYear])

    /**
     * Fusionner les doublons en gardant l'ID principal
     * @param group 
     */
    const handleMergeDuplicates = useCallback(async (group: DuplicateGroup) => {
        confirmAlert({
            title: 'Confirmation',
            message: `Voulez-vous fusionner ces ${group.total} doublons ? L'étudiant avec l'ID ${group.main_id} sera conservé.`,
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await StudentClient.post({
                            main_id: group.main_id,
                            duplicate_ids: group.ids
                        }, '/duplicates/merge')

                        if (response.ok) {
                            toast('Doublons fusionnés avec succès', {
                                closeButton: true,
                                type: 'success'
                            })
                            getDatas()
                        } else {
                            toast('Erreur lors de la fusion', {
                                closeButton: true,
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () => {}
                }
            ]
        })
    }, [])


    const handleMergeAllDuplicates = useCallback(async () => {
        confirmAlert({
            title: 'Confirmation importante',
            message: `Voulez-vous fusionner automatiquement TOUS les ${duplicates?.total_groups || 0} groupes de doublons (${duplicates?.total_duplicates || 0} étudiants) ? Cette action est irréversible.`,
            buttons: [
                {
                    label: 'Oui, fusionner tout',
                    onClick: async () => {
                        try {
                            const response = await DuplicateClient.post(requestData, '/remove')
                            if (response.ok) {
                                const result = response.data
                                toast(`Fusion terminée avec succès ! ${result.duplicates_processed || 0} groupes traités, ${result.students_merged || 0} étudiants fusionnés`, {
                                    closeButton: true,
                                    type: 'success',
                                    autoClose: 5000
                                })
                                getDatas()
                            } else {
                                toast('Erreur lors de la fusion automatique', {
                                    closeButton: true,
                                    type: 'error'
                                })
                            }
                        } catch (error) {
                            toast('Erreur lors de la fusion automatique', {
                                closeButton: true,
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non, annuler',
                    onClick: () => {
                        toast('Fusion annulée', {
                            closeButton: true,
                            type: 'info'
                        })
                    }
                }
            ]
        })
    }, [duplicates, requestData])

    /**
     * Filtrer la liste des doublons
     * @param target
     */
    const filterDuplicates = async ({target}: ChangeEvent<HTMLSelectElement>) => {
        const { value, name } = target

        if (name === 'scholar-year') {
            setScholarYear(value)
            requestData['scholar_year'] = value
        }

        if (name === 'school') {
            setSchool(parseInt(value))
            requestData['school_id'] = parseInt(value)
        }

        await DuplicateClient.get(requestData, '/check')
    }

    return (
        <>
            <PageTitle title={`Doublons d'étudiants ${!DRequestState.loading ? '(' + (duplicates?.total_groups || 0) + ' groupes - ' + (duplicates?.total_duplicates || 0) + ' doublons)' : ''}`}>
                <div className="d-flex align-items-between">
                    <SecondaryButton
                        icon="arrow-clockwise"
                        className="me-2"
                        onClick={getDatas}
                        loading={DRequestState.loading}
                        permission="student.duplicates"
                    >Recharger</SecondaryButton>
                    <PrimaryLink permission="student.view" to="/anthropo-measure/student/list" icon="list">
                        Retour à la liste
                    </PrimaryLink>
                </div>
            </PageTitle>

            {Derror && <div className="alert alert-danger">{Derror.message}</div>}

            <Block className="mb-5 mt-3">
                <table className="table table-striped m-0 table-bordered table-hover text-sm">
                    <thead>
                        <tr>
                            <th>Établissement</th>
                            <th>Année scolaire</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Select
                                    placeholder="Tous"
                                    config={{ optionKey: 'id', valueKey: 'name' }}
                                    options={schools}
                                    value={school}
                                    name="school"
                                    onChange={filterDuplicates}
                                    loading={SchoolRequestState.loading}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder={null}
                                    value={scholarYear}
                                    options={scholarYears}
                                    name="scholar-year"
                                    onChange={filterDuplicates}
                                    loading={ScholarYearRequestState.loading}
                                    controlled
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Block>

            <Block>
                <div className="alert alert-info mb-3">
                    <strong>Information:</strong> Les doublons sont groupés par nom, prénom et date de naissance identiques. 
                    L'étudiant principal (ID en gras) sera conservé lors de la fusion.
                </div>

                <div className="mb-3">
                    <DangerButton
                        icon="shuffle"
                        className="me-2"
                        onClick={handleMergeAllDuplicates}
                        loading={DRequestState.creating}
                        permission="student.merge"
                        disabled={!duplicates?.total_groups || duplicates.total_groups === 0}
                    >Fusionner tous les doublons</DangerButton>
                </div>

                <div className="table-responsive mb-4">
                    <table className="table table-striped table-bordered table-hover text-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom</th>
                                <th>Prénoms</th>
                                <th>Date de naissance</th>
                                <th>Nombre</th>
                                <th>IDs</th>
                                <th>ID Principal</th>
                                <th className="w-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DRequestState.loading && <ListLoading />}
                            {duplicates?.duplicate_groups && duplicates.duplicate_groups.length > 0 &&
                                duplicates.duplicate_groups.map((group: DuplicateGroup, index: number) => {
                                    const ids = group.ids.split(',').map(id => parseInt(id.trim()))
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="fw-bold">{group.firstname || '-'}</td>
                                            <td>{group.lastname || '-'}</td>
                                            <td>
                                                {group.birth_date ? format(group.birth_date, "dd/MM/y") : '-'}
                                            </td>
                                            <td>
                                                <span className="badge bg-warning text-dark">{group.total}</span>
                                            </td>
                                            <td className="text-nowrap">
                                                {ids.map((id, idx) => (
                                                    <span key={id}>
                                                        <span className={id === group.main_id ? 'fw-bold text-primary' : ''}>
                                                            {id}
                                                        </span>
                                                        {idx < ids.length - 1 && ', '}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="fw-bold text-primary">{group.main_id}</td>
                                            <td className="text-nowrap">
                                                {ids.map(id => (
                                                    <span key={id}>
                                                        <DetailLink 
                                                            permission="student.show" 
                                                            to={`/anthropo-measure/student/details/${id}`} 
                                                        />
                                                        {id !== group.main_id && isAllowed("student.delete") && (
                                                            <DangerButton 
                                                                permission="student.delete"
                                                                className='me-2'
                                                                icon="trash" 
                                                                size="sm"
                                                                title="Supprimer"
                                                                onClick={() => handleDelete(id)}
                                                            />
                                                        )}
                                                    </span>
                                                ))}
                                                <SecondaryButton
                                                    permission="student.merge"
                                                    icon="sign-merge-right"
                                                    size="sm"
                                                    title="Fusionner les doublons"
                                                    onClick={() => handleMergeDuplicates(group)}
                                                >
                                                    Fusionner
                                                </SecondaryButton>
                                            </td>
                                        </tr>
                                    )
                                }
                            )}
                            {!DRequestState.loading && (!duplicates?.duplicate_groups || duplicates.duplicate_groups.length === 0) && (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        Aucun doublon trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Block>
        </>
    )
}

const ListLoading = memo(function() {
    return range(10).map((number) => (
        <tr key={number}>
            {range(8).map((key) => (
                <td key={key} className="text-center">
                    <Skeleton count={1} style={{ height: 30 }} />
                </td>
            ))}
        </tr>
    ))
})