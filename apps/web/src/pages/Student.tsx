import { useApi, useExcelReader } from 'hooks'
import { ExcelExportButton, Link } from '@renderer/components'
import { class_categories, config } from '@renderer/config'
import { Block, Button, Input, Select } from 'ui'
import { useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { ageFull, number_array, range, scholar_years } from 'functions'
import { Pagination } from 'react-laravel-paginex'
import Skeleton from 'react-loading-skeleton'

const defaultScholarYear = scholar_years().at(1)

/**
 * Page d'accueil de gestion des étudiants
 * @returns JSX.Element
 */
export function Student(): JSX.Element {
    const [school, setSchool] = useState(0)
    const [classe, setClasse] = useState(0)
    const [perPage, setPerPage] = useState(30)
    const [scholarYear, setScholarYear] = useState(defaultScholarYear ?? '2023-2024')
    const [query, setQuery] = useState<string | number>('')
    const [category, setCategory] = useState<string>('')
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const { Client: SClient, RequestState: SRequestState, error: Serror, datas: students } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students',
        key: 'data'
    })

    const { Client: ScClient, datas: schools } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const { Client: ClClient, datas: classes } = useApi<Classes>({
        baseUrl: config.baseUrl,
        url: '/classes',
        key: 'data'
    })

    const { Client: ExportClient, RequestState: ExportRequestState } = useApi<Survey>({
        baseUrl: config.baseUrl,
        url: 'students'
    })

    const requestData = {
        school_id: school,
        scholar_year: scholarYear,
        classe_id: classe,
        per_page: perPage,
        q: query,
        category: category
    }

    const getDatas = (): void => {
        SClient.get(requestData)
    }

    useEffect(() => {
        getDatas()
        ScClient.get()
        ClClient.get()
    }, [])

    /**
     * Traiter la suppréssion d'un étudiant
     * @param id 
     */
    const handleDelete = async (id: number): Promise<void> => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await SClient.destroy(id)
                        if (response.ok) {
                            toast('Enregistré', {
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

    /**
     * Filtrer la liste des étudiants
     * @param target 
     */
    const filterStudents = async (target: EventTarget & (HTMLSelectElement | HTMLInputElement)): Promise<void> => {
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

        await SClient.get(requestData)
    }

    /**
     * Permet de traiter la recherche
     * @param target 
     */
    const handleSearch = async (target: EventTarget & HTMLInputElement): Promise<void> => {
        const { value } = target

        setQuery(value)
        requestData['q'] = value

        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        const newTimeoutId = setTimeout(() => {
            filterStudents(target)
        }, 500)

        setTimeoutId(newTimeoutId)
    }

    /**
     * Changer de la page de la pagination
     * @param data 
     */
    const changePage = (data: { page: number }): void => {
        SClient.get({ ...requestData, page: data.page })
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="text-primary fw-semibold">Liste des etudiants {!SRequestState.loading && <span>({students?.total})</span>}</h2>
                <div className="d-flex align-items-between">
                    <Button
                        icon="refresh"
                        mode="secondary"
                        type="button"
                        className="me-2"
                        onClick={getDatas}
                        loading={SRequestState.loading}
                    >
                        Recharger
                    </Button>
                    <Link to="/anthropo-measure/student/add" className="btn secondary-link me-2">
                        <i className="fa fa-plus me-2"></i>Nouveau
                    </Link>
                    <Link to="/anthropo-measure/student/import" className="btn primary-link">
                        <i className="fa fa-file me-2"></i>Importer une liste
                    </Link>
                </div>
            </div>

            {Serror && <div className="alert alert-danger">{Serror.message}</div>}

            <Block className="mb-5 mt-3">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Etablissement</th>
                            <th>Annee scolaire</th>
                            <th>Classe</th>
                            <th>Catégorie</th>
                            <th>Elements</th>
                            <th className="w-25">Actions</th>
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
                                    onChange={({ target }): Promise<void> => filterStudents(target)}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder={null}
                                    value={scholarYear}
                                    options={scholar_years()}
                                    name="scholar-year"
                                    onChange={({ target }): Promise<void> => filterStudents(target)}
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
                                    onChange={({ target }): Promise<void> => filterStudents(target)}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder={null}
                                    value={category}
                                    options={['Tous', ...class_categories]}
                                    name="category"
                                    onChange={({ target }): Promise<void> => filterStudents(target)}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder="Tous"
                                    value={perPage}
                                    options={number_array(100, 10)}
                                    name="per-page"
                                    onChange={({ target }): Promise<void> => filterStudents(target)}
                                    controlled
                                />
                            </td>
                            <td>
                                <ExcelExportButton
                                    ExportClient={ExportClient}
                                    url={'/to-excel'}
                                    loading={ExportRequestState.creating}
                                    requestData={{...requestData, q: undefined, paginate: false}}
                                    elements={[
                                        { params: { type: 'csv', student_only: 0 }, label: "CSV avec les filtres (Entête)" },
                                        { params: { type: 'xlsx', student_only: 0 }, label: "XLSX avec les filtres (Entête)" },
                                        { params: { type: 'csv', student_only: 1 }, label: "CSV sans les filtres" },
                                        { params: { type: 'xlsx', student_only: 1 }, label: "XLSX sans les filtres" }
                                    ]}>Exporter la liste</ExcelExportButton>
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
                        onChange={({ target }): Promise<void> => handleSearch(target)}
                        placeholder="Rechercher un étudiant..."
                        className="w-100 me-1"
                    />
                    <Button
                        icon="search"
                        loading={SRequestState.loading}
                        type="button"
                        mode="primary"
                        size="sm"
                    />
                </div>
                <div className="table-responsive">
                    <table style={{ fontSize: '10pt' }} className="table table-striped table-bordered mb-5">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Nom</th>
                                <th>Prenoms</th>
                                <th className="text-nowrap">Date de naissance</th>
                                <th>Age</th>
                                <th>Parents</th>
                                <th>Classes</th>
                                <th style={{ width: '15%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SRequestState.loading &&
                                range(10).map((number) => (
                                    <tr key={number}>
                                        {range(8).map((key) => (
                                            <td key={key} className="text-center">
                                                <Skeleton count={1} style={{ height: 30 }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            {students.data?.length > 0 &&
                                students.data.map(
                                    (studentClass: {
                                        student: Student
                                        classe: Classes
                                        id: Key | null | undefined
                                    }) => {
                                        const student = studentClass.student
                                        const classe = studentClass.classe
                                        return (
                                            <tr key={studentClass.id}>
                                                <td className="fw-bold">{student.number}</td>
                                                <td>{student.firstname}</td>
                                                <td>{student.lastname}</td>
                                                <td>{student.birth_date}</td>
                                                <td className="text-nowrap">
                                                    {ageFull(student.birth_date)}
                                                </td>
                                                <td>{student.parents}</td>
                                                <td className="text-nowrap">
                                                    {classe.name} - {studentClass.school.name}
                                                </td>
                                                <td className="text-nowrap">
                                                    <Link
                                                        className="btn-sm me-2 btn btn-info text-white"
                                                        to={`/anthropo-measure/student/details/${student.id}`}
                                                    >
                                                        <i className="fa fa-folder"></i>
                                                    </Link>
                                                    <Link
                                                        className="btn-sm me-2 btn btn-primary"
                                                        to={`/anthropo-measure/student/edit/${student.id}`}
                                                    >
                                                        <i className="fa fa-edit"></i>
                                                    </Link>
                                                    <Button
                                                        type="button"
                                                        mode="danger"
                                                        icon="trash"
                                                        size="sm"
                                                        onClick={(): void => {
                                                            handleDelete(student.id)
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    }
                                )}
                            {!SRequestState.loading && students.total === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        Aucune données
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {students.total > 0 && students.last_page > 1 && (
                    <Pagination changePage={changePage} data={students} />
                )}
            </Block>
        </>
    )
}
