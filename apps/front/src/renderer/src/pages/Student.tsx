import { useApi, useExcelReader, usePdf } from 'hooks'
import { Link } from 'react-router-dom'
import { config } from '../../config'
import { Button, Select } from 'ui'
import { ChangeEvent, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { ageFull, number_array, scholar_years } from 'functions'

import { Pagination } from 'react-laravel-paginex'

const defaultScholarYear = scholar_years().at(1)

/**
 * Page d'accueil de gestion des étudiants
 * @returns JSX.Element
 */
export function Student(): JSX.Element {
    const [school, setSchool] = useState(0)
    const [classe, setClasse] = useState(0)
    const [perPage, setPerPage] = useState(30)
    const [scholarYear, setScholarYear] = useState(defaultScholarYear)
    const { toExcel } = useExcelReader()
    const { exportToPdf } = usePdf()

    const studentRef = useRef()

    const {
        Client: SClient,
        RequestState: SRequestState,
        error: Serror,
        datas: students
    } = useApi<Student>({
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

    const requestData = {
        school_id: school,
        scholar_year: scholarYear,
        classe_id: classe,
        per_page: perPage
    }

    const getDatas = (): void => {
        SClient.get(requestData)
    }

    useEffect(() => {
        getDatas()
        ScClient.get()
        ClClient.get()
    }, [])

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
                                position: 'bottom-right'
                            })
                            getDatas()
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error',
                                position: 'bottom-right'
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
                            position: 'bottom-right'
                        })
                }
            ]
        })
    }

    const filterStudents = async (e: ChangeEvent<HTMLSelectElement>): Promise<void> => {
        e.preventDefault()
        const target = e.target

        if (target.name === 'scholar-year') {
            setScholarYear(target.value as string)
            await SClient.get({ ...requestData, scholar_year: target.value as string })
        }

        if (target.name === 'school') {
            setSchool(target.value as unknown as number)
            await SClient.get({ ...requestData, school_id: target.value as unknown as number })
        }

        if (target.name === 'classe') {
            setClasse(target.value as unknown as number)
            await SClient.get({ ...requestData, classe_id: target.value as unknown as number })
        }

        if (target.name === 'per-page') {
            setPerPage(target.value as unknown as number)
            await SClient.get({ ...requestData, per_page: target.value as unknown as number })
        }
    }

    const changePage = (data: { page: number }): void => {
        SClient.get({ ...requestData, page: data.page })
    }

    const printList = (): void => {
        const headers: unknown = [
            'Numero',
            'Nom',
            'Prenoms',
            'Date de naissance',
            'Age',
            'Parents',
            'Etablissement',
            'Classe'
        ]
        const list: unknown[][] = [headers]
        const fileName = 'Liste des etudiants.xlsx'

        const datas = students.data as {
            student: Student
            school: School
            classe: Classes
            scholar_year: string
        }[]
        datas.map((data) => {
            list.push([
                data.student.number,
                data.student.firstname,
                data.student.lastname,
                data.student.birth_date,
                ageFull(data.student.birth_date),
                data.student.parents,
                data.school.name,
                data.classe.name,
                data.scholar_year
            ])
        })

        toExcel(list, fileName)
    }

    const printPdf = (): void => {
        exportToPdf(studentRef, 'Liste des etudiants.pdf')
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="text-muted">Liste des etudiants</h2>
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
                    <Link to="/student/add" className="btn btn-primary me-2">
                        <i className="fa fa-plus me-2"></i>Nouveau
                    </Link>
                    <Link to="/student/import" className="btn btn-warning">
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
                                    onChange={filterStudents}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder={null}
                                    value={scholarYear}
                                    options={scholar_years()}
                                    name="scholar-year"
                                    onChange={filterStudents}
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
                                <Button
                                    icon="print"
                                    type="button"
                                    className="me-2"
                                    onClick={printPdf}
                                    mode="primary"
                                >
                                    Imprimer
                                </Button>
                                <Button
                                    icon="print"
                                    mode="warning"
                                    type="button"
                                    onClick={printList}
                                >
                                    Exporter
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Block>

            <Block>
                <div className="d-flex justify-content-end mb-3">
                    <h5 className="text-primary">
                        Arrếté au nombre de {students.total} étudiants(s)
                    </h5>
                </div>
                <div className="table-responsive">
                    <table ref={studentRef} className="table table-striped table-bordered mb-5">
                        <thead>
                            <tr>
                                <th>Numéro</th>
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
                            {SRequestState.loading && (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        Chargement...
                                    </td>
                                </tr>
                            )}
                            {students.data?.length > 0 &&
                                students.data.map((studentClass) => {
                                    const student = studentClass.student
                                    const classe = studentClass.classe
                                    return (
                                        <tr key={studentClass.id}>
                                            <td>{student.number}</td>
                                            <td>{student.firstname}</td>
                                            <td>{student.lastname}</td>
                                            <td>{student.birth_date}</td>
                                            <td>{ageFull(student.birth_date)}</td>
                                            <td>{student.parents}</td>
                                            <td>{classe.name}</td>
                                            <td>
                                                <Link
                                                    className="btn-sm me-2 btn btn-info text-white"
                                                    to={`/student/details/${student.id}`}
                                                >
                                                    <i className="fa fa-folder"></i>
                                                </Link>
                                                <Link
                                                    className="btn-sm me-2 btn btn-primary"
                                                    to={`/student/edit/${student.id}`}
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
                                })}
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
                {students.total > 0 && <Pagination changePage={changePage} data={students} />}
            </Block>
        </>
    )
}

const Block = (props: PropsWithChildren & { className: string }): ReactNode => {
    return <div className={`rounded shadow-lg p-3 ${props.className}`}>{props.children}</div>
}
