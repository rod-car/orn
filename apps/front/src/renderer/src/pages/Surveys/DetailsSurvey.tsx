import { useApi, useExcelReader, usePdf } from 'hooks'
import { useParams } from 'react-router-dom'
import { Block, Button, Input, Select } from 'ui'
import { config, getToken } from '../../../config'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ageFull, ageMonth, number_array, range } from 'functions'
import { Link } from '@renderer/components'
import { Pagination } from 'react-laravel-paginex'
import Skeleton from 'react-loading-skeleton'

export function DetailsSurvey(): JSX.Element {
    const [perPage, setPerPage] = useState(30)
    const [query, setQuery] = useState<string | number>('')
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const { toExcel } = useExcelReader()
    const { exportToPdf } = usePdf()

    const {
        Client,
        data: survey,
        RequestState
    } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: 'surveys'
    })

    const { id } = useParams()
    const requestData = {
        per_page: perPage,
        q: query
    }

    const getSurvey = async (id: number): Promise<void> => {
        await Client.find(id, requestData)
    }

    const refresh = useCallback(() => {
        if (survey) survey['students'] = []
        getSurvey(id as unknown as number)
    }, [])

    useEffect(() => {
        refresh()
    }, [])

    const changePage = (data: { page: number }): void => {
        Client.find(parseInt(id as string), { ...requestData, page: data.page })
    }

    const filterStudents = async (
        target: EventTarget & (HTMLSelectElement | HTMLInputElement)
    ): Promise<void> => {
        if (target.name === 'per-page') {
            setPerPage(target.value as unknown as number)
            requestData['per_page'] = parseInt(target.value)
        }

        await Client.find(parseInt(id as string), requestData)
    }

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

    const studentRef = useRef()

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

        const datas = survey?.students.data as {
            student: Student
            school: School
            classe: Classes
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
                data.classe.name
            ])
        })

        toExcel(list, fileName)
    }

    const printPdf = (): void => {
        exportToPdf(studentRef, { filename: 'Liste des etudiants.pdf' })
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h5 className="m-0">Détails de la mésure phase: {survey && survey.phase}</h5>
                <div className="d-flex">
                    <Link to="/survey/list" className="btn secondary-link me-2">
                        <i className="fa fa-list me-2"></i>Liste des mésures
                    </Link>
                    <Link to={`/survey/${id}/import-result`} className="btn primary-link">
                        <i className="fa fa-file me-2"></i>Importer des résultat
                    </Link>
                </div>
            </div>

            <Block className="mb-5">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Phase</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {survey && (
                            <tr key={survey.id}>
                                <td>{survey.id}</td>
                                <td>{survey.phase}</td>
                                <td>{survey.date}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Block>

            <Block className="mb-5 mt-3">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre d'éléments</th>
                            <th className="w-25">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Select
                                    placeholder={null}
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
                <div className="mb-5 d-flex justify-content-between">
                    <h4 className="mb-0 text-primary">
                        Resultat de l&apos;enquête ({survey?.students?.total} étudiant(s))
                    </h4>
                    <Button
                        loading={RequestState.loading}
                        onClick={refresh}
                        icon="refresh"
                        type="button"
                        mode="secondary"
                    >
                        Recharger
                    </Button>
                </div>

                <Block className="mb-5 mt-3 d-flex">
                    <Input
                        value={query}
                        name="query"
                        onChange={({ target }): Promise<void> => handleSearch(target)}
                        placeholder="Rechercher un étudiant..."
                        className="w-100 me-1"
                    />
                    <Button
                        icon="search"
                        loading={RequestState.loading}
                        type="button"
                        mode="primary"
                        size="sm"
                    />
                </Block>

                <div className="table-responsive mb-5">
                    <table
                        style={{ fontSize: '9pt' }}
                        ref={studentRef}
                        className="table table-striped table-bordered"
                    >
                        <thead>
                            <tr className="bg-danger">
                                <th className="text-nowrap">N°</th>
                                <th className="text-nowrap">Nom et prénoms</th>
                                <th className="text-nowrap">Date de pésée</th>
                                <th className="text-nowrap">Poids (g)</th>
                                <th className="text-nowrap">Taille (cm)</th>
                                <th className="text-nowrap">Age (mois)</th>
                                <th className="text-nowrap">IMC (kg/m²)</th>
                                <th className="text-nowrap">Z IMC/A</th>
                                <th className="text-nowrap">Z T/P</th>
                                <th className="text-nowrap">Z P/A F</th>
                                <th className="text-nowrap">Z P/A G</th>
                                <th className="text-nowrap">Z T/A F</th>
                                <th className="text-nowrap">Z T/A G</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RequestState.loading === false && survey?.students.total === 0 && (
                                <tr>
                                    <td className="text-center" colSpan={14}>
                                        Aucune données
                                    </td>
                                </tr>
                            )}
                            {RequestState.loading &&
                                range(10).map((number) => (
                                    <tr key={number}>
                                        {range(14).map((key) => (
                                            <td key={key} className="text-center">
                                                <Skeleton count={1} style={{ height: 30 }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            {survey &&
                                RequestState.loading === false &&
                                survey.students &&
                                survey.students.data.map((student) => (
                                    <tr key={student.id}>
                                        <td className="fw-bold">{student.number}</td>
                                        <td className="text-nowrap">
                                            {student.firstname} {student.lastname}
                                        </td>
                                        <td>{student.pivot.date}</td>
                                        <td>{student.pivot.length}</td>
                                        <td>{student.pivot.weight}</td>
                                        <td>
                                            {student.birth_date
                                                ? ageMonth(student.birth_date)
                                                : '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.imc}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_imc_age}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_height_weight}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_weight_age_female ?? '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_weight_age_male ?? '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_height_age_female ?? '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_height_age_male ?? '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            <Link
                                                to={`/survey/edit-student/${student.id}/${survey.id}`}
                                                style={{ fontSize: '9pt' }}
                                                className="btn btn-primary btn-sm me-2"
                                            >
                                                <i className="fa fa-edit"></i>
                                            </Link>
                                            <Link
                                                to={`/student/details/${student.id}`}
                                                style={{ fontSize: '9pt' }}
                                                className="btn btn-info btn-sm"
                                            >
                                                <i className="fa fa-folder"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {survey?.students?.total > 0 && survey?.students?.last_page > 1 && (
                    <Pagination changePage={changePage} data={survey?.students} />
                )}
            </Block>
        </>
    )
}
