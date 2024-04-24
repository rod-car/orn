import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { config, getToken } from '../../../config'
import { Button, Input, Select, SearchableSelect, Spinner, Block } from 'ui'
import { toast } from 'react-toastify'
import { isNumber } from 'functions/number'
import { Link } from '@renderer/components'

type BaseValue = { name: string; value: number }
type Measure = {
    student_id: number
    date: string
    length: number
    weight: number
}

const defaultMeasure = {
    student_id: 0,
    date: '',
    length: 0,
    weight: 0
}

export function AddSurveyStudent(): JSX.Element {
    const { student_id, survey_id } = useParams()
    const [studentId, setStudentId] = useState<number | undefined>(
        student_id ? parseInt(student_id) : undefined
    )
    const [surveyId, setSurveyId] = useState<number | undefined>(
        survey_id ? parseInt(survey_id) : undefined
    )

    const {
        Client: SurveyClient,
        datas: surveys,
        RequestState: SurveyRequestState
    } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/surveys',
        key: 'data'
    })

    const [selectedStudent, setSelectedStudent] = useState<Student>()
    const [phase, setPhase] = useState<number>(0)
    const [measureData, setMeasureData] = useState<Measure>(defaultMeasure)
    const [precedentMeasureData, setPrecedentMeasureData] =
        useState<Omit<Measure, 'student_id'>>(defaultMeasure)

    const { Client: StudentClient } = useApi<Student>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students',
        key: 'data'
    })

    useEffect(() => {
        const getData = async (): Promise<void> => {
            if (student_id !== undefined && survey_id !== undefined) {
                const student = (await StudentClient.find(student_id, {
                    student_only: 1
                })) as unknown as Student
                const survey = (await SurveyClient.find(survey_id, {
                    paginate_student: 0
                })) as Survey
                const surveys = await SurveyClient.get({
                    paginate_student: 0
                })

                setPhase(survey.phase)
                setSelectedStudent(student)
                handleSurveyChange(surveys, survey.phase, student.id)
            } else {
                SurveyClient.get({ paginate_student: 0 })
            }
        }
        getData()
    }, [])

    const handleStudentChange = (option, value): void => {
        const student = option as unknown as Student
        setSelectedStudent(student)
        handleSurveyChange(surveys, phase, student.id)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (selectedStudent === undefined)
            toast('Veuillez selectionner un étudiant', {
                type: 'error',
                position: 'bottom-right'
            })
        else {
            const form = event.target as HTMLFormElement
            const data = new FormData(form)
            data.append('student_id', selectedStudent.id as unknown as string)
            const response = await SurveyClient.post(data, `/${phase}/add-student`)

            if (response.ok) {
                toast('Enregistré', {
                    type: 'success',
                    position: 'bottom-right'
                })

                form.reset()
                setPhase(0)
                setSelectedStudent(undefined)
            } else {
                toast(response.message, {
                    type: 'error',
                    position: 'bottom-right'
                })
            }
        }
    }

    const handlePhaseChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        const phase = parseInt(e.target.value)
        handleSurveyChange(surveys, isNaN(phase) ? 0 : phase, selectedStudent?.id)
        setPhase(isNaN(phase) ? 0 : phase)
    }

    const handleSurveyChange = (
        surveys: Survey[],
        phase: number,
        student_id: number | undefined
    ): void => {
        const precedentSurvey = surveys.find((survey) => survey.phase == phase - 1)
        const selectedSurvey = surveys.find((survey) => survey.phase == phase)

        setSurveyId(selectedSurvey?.id) // Re assigner la valeur de l'enquête
        setStudentId(student_id) // Re assigner la valeur de l'utilisateur

        const precedentStudentDatas = precedentSurvey?.students.find((student) => {
            return student.id === student_id
        })
        const studentDatas = selectedSurvey?.students.find((student) => student.id === student_id)

        if (studentDatas !== undefined) {
            toast('Cet étudiént a déjà été mesuré pour cette phase', {
                position: 'bottom-right',
                type: 'warning',
                closeButton: true
            })
        }

        setMeasureData({
            date: studentDatas?.pivot.date ?? '',
            length: studentDatas?.pivot.length ?? 0,
            weight: studentDatas?.pivot.weight ?? 0,
            student_id: studentId ?? 0
        })

        setPrecedentMeasureData({
            date: precedentStudentDatas?.pivot.date ?? '',
            length: precedentStudentDatas?.pivot.length ?? 0,
            weight: precedentStudentDatas?.pivot.weight ?? 0
        })
    }

    const handleMeasureDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const name = e.target.name
        if (name === 'date') setMeasureData({ ...measureData, date: e.target.value })
        if (name === 'length')
            setMeasureData({ ...measureData, length: parseFloat(e.target.value) })
        if (name === 'weight')
            setMeasureData({ ...measureData, weight: parseFloat(e.target.value) })
    }

    const getStudents = async (query: string): Promise<BaseValue[]> => {
        let results: BaseValue[] = []
        const isNum = isNumber(query)

        if (isNum || (!isNum && query.length >= 3)) {
            const students = await StudentClient.get({ q: query, paginate: false, student_only: 1 })
            results = students.map((student) => {
                return {
                    name: student.number + ' - ' + student.fullname,
                    value: student.id,
                    ...student
                }
            })
        }

        return results
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Formulaire de mesure</h2>
                <Link to="/survey/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des mésures
                </Link>
            </div>

            <Block className="mb-5">
                <SearchableSelect
                    search
                    debounce={500}
                    fuzzySearch={false}
                    emptyMessage="Aucune données"
                    placeholder="Rechercher un étudiant (nom, prénoms, numéro)"
                    getOptions={(query): Promise<BaseValue[]> => getStudents(query)}
                    onChange={(value, option): void => handleStudentChange(option, value)}
                />
            </Block>

            <Block className="mb-5">
                <form action="" onSubmit={handleSubmit} method="post">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="bg-primary text-white w-50">
                                    Information de l'étudiant
                                </th>
                                <th className="bg-primary text-white">Information du mésure</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="row mt-3 pe-4">
                                        <div className="col-2 mb-3">
                                            <Input
                                                auto
                                                label="Numéro"
                                                value={selectedStudent?.number ?? 0}
                                            />
                                        </div>
                                        <div className="col-10 mb-3">
                                            <Input
                                                auto
                                                label="Nom et prénoms"
                                                value={selectedStudent?.fullname ?? ''}
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <Input
                                                auto
                                                label="Etablissement"
                                                value={selectedStudent?.schools?.at(0)?.name ?? ''}
                                            />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <Input
                                                auto
                                                label="Classe"
                                                value={selectedStudent?.classes?.at(0)?.name ?? ''}
                                            />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <Input
                                                auto
                                                label="Année scolaire"
                                                value={
                                                    selectedStudent?.classes?.at(0)?.pivot
                                                        .scholar_year ?? ''
                                                }
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td
                                    className={`${selectedStudent === undefined && 'align-middle'}`}
                                >
                                    {selectedStudent !== undefined ? (
                                        <div className="row mt-3">
                                            <div className="col-6 mb-3">
                                                <Select
                                                    label="Phase de l'enquête"
                                                    placeholder="Selectionner une phase"
                                                    config={{
                                                        optionKey: 'phase',
                                                        valueKey: 'phase'
                                                    }}
                                                    value={phase}
                                                    onChange={handlePhaseChange}
                                                    options={surveys ?? []}
                                                    controlled
                                                />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <Input
                                                    name="date"
                                                    value={measureData.date}
                                                    onChange={handleMeasureDataChange}
                                                    type="date"
                                                    label="Date de pesée"
                                                />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <Input
                                                    name="weight"
                                                    value={measureData.weight}
                                                    onChange={handleMeasureDataChange}
                                                    type="number"
                                                    label="Poids (Kg)"
                                                />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <Input
                                                    name="length"
                                                    type="number"
                                                    label="Taille (Cm)"
                                                    value={measureData.length}
                                                    onChange={handleMeasureDataChange}
                                                />
                                            </div>

                                            <div className="col-6 mb-4">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Poids précédent (Kg)
                                                    </label>
                                                    <div className="form-control bg-warning">
                                                        {precedentMeasureData.weight} Kg
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6 mb-4">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Taille précédent (Cm)
                                                    </label>
                                                    <div className="form-control bg-warning">
                                                        {precedentMeasureData.length} Cm
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 text-end">
                                                <Button
                                                    loading={SurveyRequestState.creating}
                                                    disabled={selectedStudent === undefined}
                                                    type="submit"
                                                    icon="save"
                                                    mode="primary"
                                                >
                                                    Enregistrer
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Spinner className="text-primary text-center" />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </Block>
        </>
    )
}
