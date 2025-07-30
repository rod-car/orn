/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { useParams } from 'react-router-dom'
import { Block, Button, Input, PageTitle, SecondaryButton, Select } from 'ui'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { ageMonth, ageYear, number_array, range } from 'functions'
import { DetailLink, ExcelExportButton, InfoLink, PrimaryLink } from '@base/components'
import { Pagination } from '@base/components'
import Skeleton from 'react-loading-skeleton'

export function DetailsSurvey(): ReactNode {
    const [perPage, setPerPage] = useState(30)
    const [query, setQuery] = useState<string | number>('')
    const [school, setSchool] = useState<number>(0)
    const [situation, setSituation] = useState<number>(0)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const { id } = useParams()

    const { Client, data: survey, RequestState } = useApi<Survey>({
        url: 'surveys'
    })

    const { Client: ExportClient, RequestState: ExportRequestState } = useApi<Survey>({
        url: 'surveys'
    })

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: 'schools',
        key: 'data'
    })

    const situations = [
        {
            id: 0,
            name: "Tous"
        },
        {
            id: 1,
            name: "MA"
        },
        {
            id: 2,
            name: "MAM"
        },
        {
            id: 3,
            name: "MAS"
        }
    ]

    const requestData = {
        per_page: perPage,
        q: query,
        school: school,
        situation: situation,
        regenerate: true
    }

    const getSurvey = async (id: number): Promise<void> => {
        await Client.find(id, { ...requestData, q: query, regenerate: true })
    }

    const refresh = useCallback(() => {
        if (survey) survey['students'] = []
        getSurvey(id as unknown as number)
    }, [])

    useEffect(() => {
        refresh()
        SchoolClient.get()
    }, [])

    const changePage = (data: { page: number }): void => {
        Client.find(parseInt(id as string), { ...requestData, page: data.page, regenerate: true })
    }

    /**
     * Filtrer la liste des étudiants
     * @param target 
     */
    const filterStudents = async (
        target: EventTarget & (HTMLSelectElement | HTMLInputElement)
    ): Promise<void> => {
        if (target.name === 'per-page') {
            setPerPage(parseInt(target.value))
            requestData['per_page'] = parseInt(target.value)
        }

        if (target.name === 'school') {
            setSchool(parseInt(target.value))
            requestData['school'] = parseInt(target.value)
        }

        if (target.name === 'situation') {
            setSituation(parseInt(target.value))
            requestData['situation'] = parseInt(target.value)
        }

        await Client.find(parseInt(id as string), requestData)
    }

    /**
     * Traiter la recherche d'un étudiant
     * @param target 
     */
    const handleSearch = async (target: EventTarget & HTMLInputElement) => {
        const { value } = target

        setQuery(value)
        requestData['q'] = value

        if (timeoutId) clearTimeout(timeoutId)

        const newTimeoutId = setTimeout(() => {
            filterStudents(target)
        }, 500)

        setTimeoutId(newTimeoutId)
    }

    const surveyDetails = useMemo(() => {
        if (survey && survey.phase) return `(${survey.phase} / ${survey.scholar_year}) - ${survey?.students?.total} étudiant(s)`;
        return "";
    }, [survey])

    return (
        <>
            <PageTitle title={`Détails de la mésure ${surveyDetails}`}>
                <div className="d-flex">
                    <PrimaryLink permission="anthropometry.view" to="/anthropo-measure/survey/list" icon="list" className="me-2">
                        Liste des mésures
                    </PrimaryLink>
                    <InfoLink permission="anthropometry.import" to={`/anthropo-measure/survey/${id}/import-result`} icon="file-earmark-text">
                        Importer des résultat
                    </InfoLink>
                </div>
            </PageTitle>

            <Block className="mb-5 mt-3">
                <table className="table table-striped table-bordered m-0">
                    <thead>
                        <tr>
                            <th>Nombre d'étudiants</th>
                            <th>Etablissement</th>
                            <th>Situation</th>
                            <th>Actions</th>
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
                                    onChange={({ target }): Promise<void> => filterStudents(target)}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder="Tous"
                                    config={{ optionKey: 'id', valueKey: 'name' }}
                                    options={schools}
                                    loading={SchoolRequestState.loading}
                                    value={school}
                                    name="school"
                                    onChange={({ target }): Promise<void> => filterStudents(target)}
                                    controlled
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder={null}
                                    config={{ optionKey: 'id', valueKey: 'name' }}
                                    options={situations}
                                    value={situation}
                                    name="situation"
                                    onChange={({ target }) => filterStudents(target)}
                                    controlled
                                />
                            </td>
                            <td className="d-flex align-items-center">
                                <ExcelExportButton
                                    permission="export.anthropometry"
                                    ExportClient={ExportClient}
                                    url={'/' + survey?.id + '/to-excel?need_student=1&paginate_student=0'}
                                    loading={ExportRequestState.creating}
                                    requestData={requestData}
                                    elements={[
                                        { params: { type: 'csv', result: false }, label: "Excel CSV"},
                                        { params: { type: 'xlsx', result: false }, label: "Excel XLSX" },
                                        { params: { type: 'csv', result: true }, label: "Excel avec résultats CSV" },
                                        { params: { type: 'xlsx', result: true }, label: "Excel avec résultats XLSX" }
                                    ]}>Exporter les résultats</ExcelExportButton>
                                <SecondaryButton
                                    loading={RequestState.loading}
                                    onClick={refresh}
                                    icon="arrow-clockwise"
                                >Recharger</SecondaryButton>
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
                        loading={RequestState.loading}
                        type="button"
                        mode="primary"
                        size="sm"
                    />
                </div>

                <div className="table-responsive mb-5">
                    <table style={{ fontSize: '9pt' }} className="table table-striped table-bordered">
                        <thead>
                            <tr className="bg-danger">
                                <th className="text-nowrap text-white bg-primary">N°</th>
                                <th className="text-nowrap text-white bg-primary">Nom et prénoms</th>
                                <th className="text-nowrap text-white bg-primary">Date de pesée</th>
                                <th className="text-nowrap text-white bg-primary">Taille (cm)</th>
                                <th className="text-nowrap text-white bg-primary">Poids (Kg)</th>
                                <th className="text-nowrap text-white bg-primary">Age (mois)</th>
                                <th className="text-nowrap text-white bg-primary">IMC (kg/m²)</th>
                                <th className="text-nowrap text-white bg-primary">Z IMC/A</th>
                                <th className="text-nowrap text-white bg-primary">Z T/P</th>
                                <th className="text-nowrap text-white bg-primary">Z P/A F</th>
                                <th className="text-nowrap text-white bg-primary">Z P/A G</th>
                                <th className="text-nowrap text-white bg-primary">Z T/A F</th>
                                <th className="text-nowrap text-white bg-primary">Z T/A G</th>
                                <th className="text-white bg-primary">Actions</th>
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
                                                ? `${ageMonth(student.birth_date, student.pivot.date)} (${ageYear(student.birth_date, student.pivot.date)})`
                                                : '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.imc}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.age_year > 5 ? student.pivot.z_imc_age : '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.age_year <= 5 ? student.pivot.z_height_weight : '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.gender === 'Fille' ? student.pivot.z_weight_age : '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.gender !== 'Fille' ? student.pivot.z_weight_age : '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.gender === 'Fille' ? student.pivot.z_height_age : '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.gender !== 'Fille' ? student.pivot.z_height_age : '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            <DetailLink permission="student.show" to={`/anthropo-measure/student/details/${student.id}`} />
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