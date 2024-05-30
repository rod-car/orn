import { useApi } from 'hooks'
import { FormEvent, useEffect, useState } from 'react'
import { config, getToken } from '@renderer/config'
import { Input, Select, Block, Spinner } from 'ui'
import { toast } from 'react-toastify'
import { Link } from '@renderer/components'
import Skeleton from 'react-loading-skeleton'
import { scholar_years } from 'functions'

type StudentData = {
    student_id: number
    fullname: string
    precedentHeight: number | null | undefined
    precedentWeight: number | null | undefined
    height: number
    weight: number
    birth_date: string
    saved: boolean
}

export function AddSurveyStudent(): JSX.Element {
    const [formData, setFormData] = useState<{school_id: 0,
        class_id: number,
        survey_id: number,
        date: string,
        scholar_year: string,
        students: StudentData[]
    }>({
        school_id: 0,
        class_id: 0,
        survey_id: 0,
        date: '',
        scholar_year: '',
        students: []
    })

    const [precedentPhase, setPrecedentPhase] = useState<number | null | undefined>(null)

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

    const { Client: StudentClient, RequestState: StudentRequestState } = useApi<Student>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students',
        key: 'data'
    })

    const { Client: SchoolClient, RequestState: SchoolRS, datas: schools } = useApi<School>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassClient, RequestState: ClassRS, datas: classes } = useApi<School>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/classes',
        key: 'data'
    })

    useEffect(() => {
        SurveyClient.get()
        ClassClient.get()
        SchoolClient.get()
    }, [])

    function handleChange(target: EventTarget & (HTMLInputElement | HTMLSelectElement), index?: number) {
        if (target.name.includes('students') && index !== undefined) {
            const nameParts = target.name.split('.')
            
            formData.students[index][nameParts[1]] = target.value
            setFormData({...formData})

            setTimeout(async function() {
                // Check if can update in the database
                const selectedStudent = formData.students[index]
                const height = selectedStudent.height
                const weight = selectedStudent.weight

                if (height > 0 && weight > 0) {
                    if ((selectedStudent.precedentHeight && selectedStudent.precedentHeight > height)) {
                        toast("La taille de l'étudiant ne doit pas être inférieur a la taille précedente", {
                            position: config.toastPosition,
                            type: "error"
                        })
                        return
                    }
                    const formDatas = {
                        student_id: selectedStudent.student_id,
                        date: formData.date,
                        school_id: formData.school_id,
                        scholar_year: formData.scholar_year,
                        weight: selectedStudent.weight,
                        length: selectedStudent.height
                    }
                    const response = await SurveyClient.post(formDatas, `/${formData.survey_id}/add-student`)
                    if (response.ok) {
                        formData.students[index].saved = true
                        setFormData({...formData})
                    }
                }
            }, 1000)
        } else {
            setFormData({...formData, [target.name]: target.value})
        }
    }

    function canDisplayTable(): boolean {
        return formData.school_id !== 0 && formData.class_id !== 0 && formData.scholar_year !== '' && formData.date !== '' && formData.survey_id !== 0
    }

    useEffect(() => {
        async function getStudents() {
            if (formData.school_id && formData.class_id && formData.scholar_year && formData.survey_id) {
                // Get list of the students concerned by the criteria
                let measuredStudents: Student[] = []
                let precedentMeasuredStudents: Student[] = []

                const selectedSurvey = await SurveyClient.find(formData.survey_id, {
                    paginate_student: 0
                })

                let precedentSurveyId: number | null = null;
                
                for (let index = formData.survey_id; index > 1; index--) {
                    precedentSurveyId = index - 1
                    if (precedentSurveyId === 1) {
                        const precedentSurvey = await SurveyClient.find(precedentSurveyId, {
                            paginate_student: 0
                        })
            
                        if (precedentSurvey !== undefined) {
                            precedentMeasuredStudents = precedentSurvey?.students as Student[]
                            break
                        }
                    }
                }

                if (selectedSurvey) {
                    measuredStudents = selectedSurvey.students;
                    formData.date = measuredStudents?.at(0)?.pivot?.date
                }

                const students = await StudentClient.get({
                    paginate: false,
                    school_id: formData.school_id,
                    classe_id: formData.class_id,
                    scholar_year: formData.scholar_year
                })
                
                if (students && students.length > 0) {
                    const studentDatas: StudentData[] = []

                    students.map(studentClass => {
                        const foundStudent = measuredStudents.find(student => student.id === studentClass.student.id)
                        const precedentStudent = precedentMeasuredStudents.find(student => student.id === studentClass.student.id)
                        
                        const firstName = studentClass.student.firstname
                        const lastName = studentClass.student.lastname
                        const fullName = firstName + " " + (lastName === null ? '' : lastName)
                        const precedentHeight = precedentStudent ? precedentStudent.pivot.length : null
                        const precedentWeight = precedentStudent ? precedentStudent.pivot.weight : null

                        precedentStudent ?? setPrecedentPhase(precedentSurveyId)

                        studentDatas.push({
                           fullname: fullName,
                           birth_date: studentClass.student.birth_date,
                           height: foundStudent ? foundStudent.pivot.length ?? 0 : 0,
                           student_id: studentClass.student_id,
                           precedentHeight: precedentHeight,
                           precedentWeight: precedentWeight,
                           weight: foundStudent ? foundStudent.pivot.weight ?? 0 : 0,
                           saved: foundStudent ? true : false
                       })
                    })
                    setFormData({...formData, students: studentDatas})
                }
            }
        }

        getStudents()
    }, [formData.school_id, formData.class_id, formData.scholar_year, formData.survey_id])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Formulaire de mesure</h2>
                <Link to="/anthropo-measure/survey/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des mésures
                </Link>
            </div>

            <Block className="mb-5">
                <form action="" method="post">
                    <div className="row mb-5">
                        <div className="col-6 mb-3">
                            <Select
                                label='Etablissement'
                                options={schools}
                                config={{ optionKey: 'id', valueKey: 'name' }}
                                loading={SchoolRS.loading}
                                placeholder="Selectionner un école"
                                onChange={({target}) => handleChange(target)}
                                name='school_id'
                                value={formData.school_id}
                                controlled />
                        </div>
                        <div className="col-6 mb-3">
                            <Select
                                label='Classe'
                                options={classes}
                                config={{ optionKey: 'id', valueKey: 'name' }}
                                loading={ClassRS.loading}
                                placeholder="Selectionner une classe"
                                onChange={({target}) => handleChange(target)}
                                name='class_id'
                                value={formData.class_id}
                                controlled />
                        </div>
                        <div className="col-6 mb-3">
                            <Select
                                label='Année scolaire'
                                options={scholar_years()}
                                placeholder="Année scolaire"
                                onChange={({target}) => handleChange(target)}
                                name='scholar_year'
                                value={formData.scholar_year}
                                controlled />
                        </div>
                        <div className="col-3 mb-3">
                            <Input
                                type="date"
                                label='Date de pesée'
                                onChange={({target}) => handleChange(target)}
                                name='date'
                                value={formData.date} />
                        </div>
                        <div className="col-3 mb-3">
                            <Select
                                label="Phase d'enquête"
                                options={surveys}
                                config={{ valueKey: 'phase', optionKey: 'id' }}
                                placeholder="Selectionner une phase"
                                onChange={({target}) => handleChange(target)}
                                name='survey_id'
                                value={formData.survey_id}
                                loading={SurveyRequestState.loading}
                                controlled />
                        </div>
                    </div>

                    {SurveyRequestState.loading && <Spinner className="text-center" isBorder />}

                    {canDisplayTable() && <table className='table table-striped table-bordered mb-5'>
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th className='text-nowrap'>Nom et prénoms</th>
                                <th className='text-nowrap'>Date de naissance</th>
                                <th className='text-nowrap'>Taille Pr {precedentPhase !== null ? `(${precedentPhase})` : ''}</th>
                                <th className='text-nowrap'>Poids Pr {precedentPhase !== null ? `(${precedentPhase})` : ''}</th>
                                <th>Taille</th>
                                <th>Poids</th>
                                <th>Etat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(SurveyRequestState.loading || StudentRequestState.loading) && <tr><td className="text-center" colSpan={8}>Chargement</td></tr>}
                            {formData.students && formData.students.map((student, index) => <tr key={student.student_id} className='align-middle'>
                                <td>{student.student_id}</td>
                                <td>{student.fullname}</td>
                                <td>{student.birth_date}</td>
                                <td>{student.precedentHeight}</td>
                                <td>{student.precedentWeight}</td>
                                <td>
                                    <Input onChange={({target}) => handleChange(target, index)} name="students.height" type='number' placeholder='Taille' value={student.height} />
                                </td>
                                <td>
                                    <Input onChange={({target}) => handleChange(target, index)} name="students.weight" type='number' placeholder='Poids' value={student.weight} />
                                </td>
                                <td className="text-center">{student.saved ? <span className="fw-bold text-success">OK</span> : <span className="fw-bold text-danger">KO</span>}</td>
                            </tr>)}
                        </tbody>
                    </table>}
                </form>
            </Block>
        </>
    )
}
