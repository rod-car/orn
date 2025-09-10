/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { DetailLink, EditLink, ExcelExportButton, InfoLink, PrimaryLink } from '@base/components'
import { class_categories, config } from '@base/config'
import { Block, DangerButton, Input, PageTitle, PrimaryButton, SecondaryButton, Select } from 'ui'
import { ChangeEvent, Key, memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { ageFull, format, number_array, range } from 'functions'
import { Pagination } from '@base/components'
import Skeleton from 'react-loading-skeleton'

type StudentClass = {
    student: Student;
    classe: Classes;
    school: School;
    id: Key | null | undefined;
}

/**
 * Page d'accueil de gestion des étudiants
 * @returns ReactNode
 */
export function StudentList(): ReactNode {
    const [school, setSchool] = useState(0)
    const [classe, setClasse] = useState(0)
    const [perPage, setPerPage] = useState(30)
    const [scholarYear, setScholarYear] = useState<string | number>(4)
    const [query, setQuery] = useState<string | number>('')
    const [category, setCategory] = useState<string>('')
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const { Client: StudentClient, RequestState: SRequestState, error: Serror, datas: students } = useApi<Student>({
        url: '/students',
        key: 'data'
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
        url: 'students'
    })

    const { Client: ScholarYearClient, datas: scholarYears, RequestState: ScholarYearRequestState } = useApi<Survey>({
        url: 'scholar-years'
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

    const { user, isAllowed } = useAuthStore()

    useEffect(() => {
        if (user?.school) {
            requestData.school_id = user.school.id
            setSchool(user.school.id)
        }
        SchoolClient.get()
        ClassClient.get()
        ScholarYearClient.get()

        getDatas()
    }, [])

    /**
     * Traiter la suppréssion d'un étudiant
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
    }, [])

    /**
     * Filtrer la liste des étudiants
     * @param target 
     */
    const filterStudents = async ({target}: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
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

    return (
        <>
            <PageTitle title={`Liste des etudiants ${!SRequestState.loading ? '(' + students?.total + ')' : ''}`}>
                <div className="d-flex align-items-between">
                    <SecondaryButton
                        icon="arrow-clockwise"
                        className="me-2"
                        onClick={getDatas}
                        loading={SRequestState.loading}
                        permission="student.view"
                    >Recharger</SecondaryButton>
                    <PrimaryLink permission="student.create" to="/anthropo-measure/student/add" icon="plus" className="me-2">Nouveau etudiant</PrimaryLink>
                    <InfoLink permission="student.import" to="/anthropo-measure/student/import" icon="file-earmark-text">Importer une liste des etudiants</InfoLink>
                </div>
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
                            <th>Elements</th>
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
                                <th>Code</th>
                                <th>Nom</th>
                                <th>Prénoms</th>
                                <th>Sexe</th>
                                <th className="text-nowrap">Date de naissance</th>
                                <th>Âge</th>
                                <th>Parents</th>
                                <th>Classes</th>
                                <th className="w-15">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SRequestState.loading && <ListLoading />}
                            {students.data?.length > 0 &&
                                students.data.map((studentClass: StudentClass) => {
                                    const student = studentClass.student
                                    if (student === null) debugger
                                    const classe = studentClass.classe
                                    return (
                                        <tr key={studentClass.id}>
                                            <td className="fw-bold">{student.number}</td>
                                            <td>{student.firstname}</td>
                                            <td>{student.lastname}</td>
                                            <td>{student.gender}</td>
                                            <td>{format(student.birth_date, "dd/MM/y")}</td>
                                            <td className="text-nowrap">
                                                {ageFull(student.birth_date)}
                                            </td>
                                            <td>{student.parents}</td>
                                            <td className="text-nowrap">
                                                {classe.name} - {studentClass.school.name}
                                            </td>
                                            <td className="text-nowrap">
                                                <DetailLink permission="student.show" to={`/anthropo-measure/student/details/${student.id}`} />
                                                {isAllowed("student.edit", studentClass.school.id) && <EditLink permission="student.edit" to={`/anthropo-measure/student/edit/${student.id}`} />}
                                                {isAllowed("student.delete", studentClass.school.id) && <DangerButton permission="student.delete" icon="trash" size="sm"
                                                    onClick={() => {
                                                        handleDelete(student.id)
                                                    }}
                                                />}
                                            </td>
                                        </tr>
                                    )
                                }
                            )}
                            {!SRequestState.loading && students.total === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center">
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

const ListLoading = memo(function() {
    return range(10).map((number) => (
        <tr key={number}>
            {range(9).map((key) => (
                <td key={key} className="text-center">
                    <Skeleton count={1} style={{ height: 30 }} />
                </td>
            ))}
        </tr>
    ))
})
