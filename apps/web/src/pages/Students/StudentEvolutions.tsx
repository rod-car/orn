/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { DetailLink, EditLink, ExcelExportButton } from '@base/components'
import { class_categories, config } from '@base/config'
import { Block, DangerButton, Input, PageTitle, PrimaryButton, SecondaryButton, Select } from 'ui'
import React, { ChangeEvent, memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { ageFull, format, number_array, range } from 'functions'
import { Pagination } from '@base/components'
import Skeleton from 'react-loading-skeleton'

type SurveyData = {
    survey_id: number;
    date: string;
    phase_number: number;
    weight: number | null;
    length: number | null;
    imc: string | null;
    z_imc_age: number | null;
    z_height_age: number | null;
    z_weight_age: number | null;
    z_height_weight: number | null;
    weight_evolution: string | null;
    length_evolution: string | null;
}

type StudentWithEvolution = {
    id: number;
    lastname: string;
    firstname: string;
    gender: string;
    birth_date: string;
    birth_place: string;
    parents: string;
    number: number;
    created_at: string;
    updated_at: string;
    surveys: SurveyData[];
}

type StudentEvolutionsResponse = {
    data: StudentWithEvolution[];
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        has_more_pages: boolean;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}

/**
 * Page d'affichage des évolutions des étudiants
 * @returns ReactNode
 */
export function StudentEvolutions(): ReactNode {
    const [school, setSchool] = useState(0)
    const [classe, setClasse] = useState(0)
    const [perPage, setPerPage] = useState(30)
    const [scholarYear, setScholarYear] = useState<string | number>(4)
    const [query, setQuery] = useState<string | number>('')
    const [category, setCategory] = useState<string>('')
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const [expandedStudents, setExpandedStudents] = useState<Set<number>>(new Set())

    // API pour récupérer les évolutions des étudiants
    const { Client: StudentClient, RequestState: SRequestState, error: Serror, datas: studentsEvolution } = useApi<StudentEvolutionsResponse>({
        url: '/students/evolutions',
    })

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassClient, datas: classes, RequestState: ClassRequestState } = useApi<Classes>({
        url: '/classes',
        key: 'data'
    })

    const { Client: ExportClient, RequestState: ExportRequestState } = useApi<Survey>({
        url: 'students/evolutions'
    })

    const { Client: ScholarYearClient, datas: scholarYears, RequestState: ScholarYearRequestState } = useApi<Survey>({
        url: 'scholar-years'
    })

    const { Client: SurveyClient } = useApi<Survey>({
        url: 'surveys'
    })

    const requestData = useMemo(() => {
        return {
            school_id: school,
            scholar_year: scholarYear,
            classe_id: classe,
            per_page: perPage,
            q: query,
            category: category
        }
    }, [school, scholarYear, classe, perPage, query, category])

    const getDatas = useCallback(() => {
        StudentClient.get(requestData)
    }, [requestData])

    const { user } = useAuthStore()

    useEffect(() => {
        if (user?.school) {
            requestData.school_id = user.school.id
            setSchool(user.school.id)
        }
        SchoolClient.get()
        ClassClient.get()
        ScholarYearClient.get()
        SurveyClient.get()

        getDatas()
    }, [])

    /**
     * Toggle l'expansion d'un étudiant pour voir ses évolutions
     */
    const toggleStudentExpansion = useCallback((studentId: number) => {
        setExpandedStudents(prev => {
            const newSet = new Set(prev)
            if (newSet.has(studentId)) {
                newSet.delete(studentId)
            } else {
                newSet.add(studentId)
            }
            return newSet
        })
    }, [])

    /**
     * Traiter la suppression d'un étudiant
     * @param id 
     */
    const handleDelete = useCallback(async (id: number) => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await StudentClient.destroy(id)
                        if (response.ok) {
                            toast('Supprimé', {
                                closeButton: true,
                                type: 'success',
                                position: config.toastPosition
                            })
                            getDatas()
                        } else {
                            toast('Erreur de suppression', {
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
    }, [])

    /**
     * Filtrer la liste des étudiants
     * @param target 
     */
    const filterStudents = async ({ target }: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { value, name } = target

        if (name === 'scholar-year') {
            setScholarYear(value)
            requestData['scholar_year'] = value
        }

        if (name === 'school') {
            setSchool(parseInt(value))
            requestData['school_id'] = parseInt(value)
        }

        if (name === 'classe') {
            setClasse(parseInt(value))
            requestData['classe_id'] = parseInt(value)
        }

        if (name === 'per-page') {
            setPerPage(parseInt(value))
            requestData['per_page'] = parseInt(value)
        }

        if (name === 'category') {
            setCategory(value)
            requestData['category'] = value
        }

        await StudentClient.get(requestData)
    }

    /**
     * Permet de traiter la recherche
     * @param target 
     */
    const handleSearch = useCallback(async (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = event.target

        setQuery(value)
        requestData['q'] = value

        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        const newTimeoutId = setTimeout(() => {
            filterStudents(event)
        }, 500)

        setTimeoutId(newTimeoutId)
    }, [setQuery, setTimeoutId, filterStudents])

    /**
     * Changer de la page de la pagination
     * @param data 
     */
    const changePage = useCallback((data: { page: number }) => {
        StudentClient.get({ ...requestData, page: data.page })
    }, [requestData])

    /**
     * Formater la valeur d'évolution avec couleur
     */
    const formatEvolution = (evolution: string | null, type: 'weight' | 'length') => {
        if (!evolution) return '-'

        const isPositive = evolution.startsWith('+')
        const colorClass = isPositive ? 'text-success' : 'text-danger'
        const icon = type === 'weight' ? '⚖️' : '📏'

        return (
            <span className={`${colorClass} fw-bold`}>
                {icon} {evolution}
            </span>
        )
    }

    /**
     * Formater les indicateurs Z-score
     */
    const formatZScore = (value: number | null) => {
        if (value === null) return '-'
        return value.toFixed(2)
    }

    return (
        <>
            <PageTitle title={`Évolutions des étudiants ${!SRequestState.loading && studentsEvolution?.pagination ? '(' + studentsEvolution.pagination.total + ')' : ''}`}>
                <SecondaryButton
                    icon="arrow-clockwise"
                    className="me-2"
                    onClick={getDatas}
                    loading={SRequestState.loading}
                    permission="student.view"
                >Recharger</SecondaryButton>
            </PageTitle>

            {Serror && <div className="alert alert-danger">{Serror.message}</div>}

            <Block className="mb-5 mt-3">
                <table className="table table-striped m-0 table-bordered table-hover text-sm">
                    <thead>
                        <tr>
                            <th>Établissement</th>
                            <th>Année scolaire</th>
                            <th>Classe</th>
                            <th>Catégorie</th>
                            <th>Éléments</th>
                            <th className="w-15">Actions</th>
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
                                    onChange={filterStudents}
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
                                    onChange={filterStudents}
                                    loading={ScholarYearRequestState.loading}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder="Tous"
                                    config={{ optionKey: 'id', valueKey: 'name' }}
                                    value={classe}
                                    options={classes}
                                    name="classe"
                                    onChange={filterStudents}
                                    loading={ClassRequestState.loading}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder={null}
                                    value={category}
                                    options={['Tous', ...class_categories]}
                                    name="category"
                                    onChange={filterStudents}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder="Tous"
                                    value={perPage}
                                    options={number_array(100, 10)}
                                    name="per-page"
                                    onChange={filterStudents}
                                    controlled
                                />
                            </td>
                            <td>
                                <ExcelExportButton
                                    permission="export.student-list"
                                    ExportClient={ExportClient}
                                    url={'/export'}
                                    loading={ExportRequestState.creating}
                                    requestData={{ ...requestData, q: undefined, paginate: false }}
                                    elements={[
                                        { params: { type: 'csv' }, label: "CSV avec évolutions" },
                                        { params: { type: 'xlsx' }, label: "XLSX avec évolutions" }
                                    ]}>Exporter évolutions</ExcelExportButton>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Block>

            <Block>
                <div className="mb-5 mt-3 d-flex">
                    <Input
                        value={query}
                        name="query"
                        onChange={handleSearch}
                        placeholder="Rechercher un étudiant..."
                        className="w-100 me-1"
                    />
                    <PrimaryButton permission="student.view" icon="search" loading={SRequestState.loading} size="sm" />
                </div>

                <div className="table-responsive mb-4">
                    <table className="table table-striped table-bordered table-hover text-sm">
                        <thead>
                            <tr>
                                <th>Expand</th>
                                <th>Code</th>
                                <th>Nom</th>
                                <th>Prénoms</th>
                                <th>Sexe</th>
                                <th className="text-nowrap">Date de naissance</th>
                                <th>Âge</th>
                                <th>Parents</th>
                                <th>Nb Mesures</th>
                                <th className="w-15">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SRequestState.loading && <ListLoading />}
                            {studentsEvolution?.data?.length > 0 &&
                                studentsEvolution.data.map((student: StudentWithEvolution) => {
                                    const isExpanded = expandedStudents.has(student.id)
                                    const measurementsCount = student.surveys.filter(s => s.weight !== null || s.length !== null).length

                                    return <React.Fragment key={student.id}>
                                        <tr>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => toggleStudentExpansion(student.id)}
                                                    title={isExpanded ? "Masquer les évolutions" : "Voir les évolutions"}
                                                >
                                                    <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                                                </button>
                                            </td>
                                            <td className="fw-bold">{student.number}</td>
                                            <td>{student.firstname}</td>
                                            <td>{student.lastname}</td>
                                            <td>{student.gender}</td>
                                            <td>{format(student.birth_date, "dd/MM/y")}</td>
                                            <td className="text-nowrap">
                                                {ageFull(student.birth_date)}
                                            </td>
                                            <td>{student.parents}</td>
                                            <td className="text-center">
                                                <span className={`badge ${measurementsCount > 0 ? 'bg-success' : 'bg-secondary'}`}>
                                                    {measurementsCount}
                                                </span>
                                            </td>
                                            <td className="text-nowrap">
                                                <DetailLink permission="student.show" to={`/anthropo-measure/student/details/${student.id}`} />
                                                <EditLink permission="student.edit" to={`/anthropo-measure/student/edit/${student.id}`} />
                                                <DangerButton
                                                    permission="student.delete"
                                                    icon="trash"
                                                    size="sm"
                                                    onClick={() => handleDelete(student.id)}
                                                />
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={10} className="p-0">
                                                    <div className="bg-light p-3">
                                                        <h6 className="mb-3">📊 Évolutions de {student.firstname} {student.lastname}</h6>
                                                        <div className="table-responsive">
                                                            <table className="table table-sm table-bordered mb-0">
                                                                <thead className="table-dark">
                                                                    <tr>
                                                                        <th>Date</th>
                                                                        <th>Phase</th>
                                                                        <th>Poids (kg)</th>
                                                                        <th>Évol. Poids</th>
                                                                        <th>Taille (cm)</th>
                                                                        <th>Évol. Taille</th>
                                                                        <th>IMC</th>
                                                                        <th>Z-IMC/Âge</th>
                                                                        <th>Z-Taille/Âge</th>
                                                                        <th>Z-Poids/Âge</th>
                                                                        <th>Z-Taille/Poids</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {student.surveys.map((survey) => (
                                                                        <tr key={survey.survey_id} className={survey.weight || survey.length ? '' : 'table-secondary'}>
                                                                            <td>{format(survey.date, "dd/MM/y")}</td>
                                                                            <td className="text-center">
                                                                                <span className="badge bg-primary">
                                                                                    Phase {survey.phase_number}
                                                                                </span>
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {survey.weight ? survey.weight.toFixed(1) : '-'}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {formatEvolution(survey.weight_evolution, 'weight')}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {survey.length ? survey.length.toFixed(1) : '-'}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {formatEvolution(survey.length_evolution, 'length')}
                                                                            </td>
                                                                            <td className="text-center">{survey.imc || '-'}</td>
                                                                            <td className="text-center">{formatZScore(survey.z_imc_age)}</td>
                                                                            <td className="text-center">{formatZScore(survey.z_height_age)}</td>
                                                                            <td className="text-center">{formatZScore(survey.z_weight_age)}</td>
                                                                            <td className="text-center">{formatZScore(survey.z_height_weight)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                }
                                )}
                            {!SRequestState.loading && studentsEvolution?.pagination?.total === 0 && (
                                <tr>
                                    <td colSpan={10} className="text-center">
                                        Aucune données
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {studentsEvolution?.pagination && studentsEvolution.pagination.total > 0 && studentsEvolution.pagination.last_page > 1 && (
                    <Pagination changePage={changePage} data={studentsEvolution.pagination} />
                )}
            </Block>
        </>
    )
}

const ListLoading = memo(function () {
    return range(10).map((number) => (
        <tr key={number}>
            {range(10).map((key) => (
                <td key={key} className="text-center">
                    <Skeleton count={1} style={{ height: 30 }} />
                </td>
            ))}
        </tr>
    ))
})