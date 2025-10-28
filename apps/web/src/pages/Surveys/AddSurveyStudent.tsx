/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { ReactNode, useEffect, useState } from 'react'
import { class_categories, config } from '@base/config'
import { Input, Select, Block, Button, PageTitle } from 'ui'
import { toast } from '@base/ui';
import { PrimaryLink, SurveySelector } from '@base/components'

type StudentData = {
    code: ReactNode
    student_id: number
    fullname: string
    precedentHeight: number | null | undefined
    precedentWeight: number | null | undefined
    height: number
    weight: number
    birth_date: string
    saved: boolean
}

type FormData = {
    school_id: number
    class_id: number
    category: string
    survey_id: number
    date: string
    scholar_year: string
    students: StudentData[]
}

const defaultFormData: FormData = {
    school_id: 0,
    class_id: 0,
    category: '',
    survey_id: 0,
    date: '',
    scholar_year: '',
    students: []
}

export function AddSurveyStudent(): ReactNode {
    const [formData, setFormData] = useState<FormData>(defaultFormData)
    const [surveyId, setSurveyId] = useState(0);

    const { Client: SurveyListClient, datas: surveysList, RequestState: SurveyListRequestState } = useApi<Survey>({
        url: '/surveys',
        key: 'data'
    })

    const { Client: SurveyClient, RequestState: SurveyRequestState } = useApi<Survey>({
        url: '/surveys',
        key: 'data'
    })

    const { Client: StudentClient, RequestState: StudentRequestState } = useApi<Student>({
        url: '/students',
        key: 'data'
    })

    const { Client: SchoolClient, RequestState: SchoolRS, datas: schools } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassClient, RequestState: ClassRS, datas: classes } = useApi<School>({
        url: '/classes',
        key: 'data'
    })

    const { user } = useAuthStore()

    useEffect(() => {
        if (user?.school) setFormData({ ...formData, school_id: user.school.id })
        SurveyListClient.get()
        ClassClient.get({ need_student: false })
        SchoolClient.get()
    }, [])

    function handleChange(target: EventTarget & (HTMLInputElement | HTMLSelectElement), index?: number) {
        if (target.name.includes('students') && index !== undefined) {
            const nameParts = target.name.split('.')
            formData.students[index][nameParts[1]] = target.value
            setFormData({ ...formData })
        } else {
            setFormData({ ...formData, [target.name]: target.value })
        }
    }

    async function saveData(index: number) {
        const selectedStudent = formData.students[index]
        const height = selectedStudent.height
        const weight = selectedStudent.weight

        if (height > 0 && weight > 0) {
            if ((selectedStudent.precedentHeight && selectedStudent.precedentHeight > height)) {
                toast("La taille de l'étudiant ne doit pas être inférieur a la taille précédente", {
                    type: "error"
                })
                return
            }

            toast("Enregistrement en cours", {
                type: "info"
            })

            const datas = {
                student_id: selectedStudent.student_id,
                date: formData.date,
                school_id: formData.school_id,
                scholar_year: formData.scholar_year,
                weight: selectedStudent.weight,
                length: selectedStudent.height
            }

            const response = await SurveyClient.post(datas, `/${surveyId}/add-student`)
            if (response.ok) {
                toast("Enregistré", {
                    type: "success"
                })
                formData.students[index].saved = true
                setFormData({ ...formData })
            } else {
                toast("Erreur d'enregistrement", {
                    type: "error"
                })
            }
        } else {
            toast("La taille ou le poids ne doit pas être zero", {
                type: "error"
            })
        }
    }

    async function removeData(index: number) {
        const selectedStudent = formData.students[index]
        const height = selectedStudent.height
        const weight = selectedStudent.weight

        if (height <= 0 && weight <= 0) {
            toast("Non enregistré", {
                type: "error"
            })
            return
        }

        toast("Suppression en cours", {
            
            type: "info"
        })

        const formDatas = {
            student_id: selectedStudent.student_id,
            school_id: formData.school_id,
            scholar_year: formData.scholar_year
        }
        const response = await SurveyClient.post(formDatas, `/${surveyId}/remove-student`)
        if (response.ok) {
            toast("Supprimé", {
                type: "success"
            })
            formData.students[index].saved = false
            formData.students[index].weight = 0
            formData.students[index].height = 0
            setFormData({ ...formData })
        }
    }

    function canDisplayTable(): boolean {
        return formData.school_id !== 0 && formData.class_id !== 0 && formData.date !== '' && formData.date !== undefined && surveyId > 0
    }

    function isValid(formData: FormData) {
        return surveyId > 0 && formData.school_id && formData.class_id
    }

    async function getStudents() {
        if (isValid(formData)) {
            const selectedSurvey = await SurveyClient.find(surveyId, {
                paginate_student: 0,
            }) as Survey

            const measuredStudents: Student[] = selectedSurvey.students;
            formData.date = measuredStudents?.at(0)?.pivot?.date ?? formData.date;

            const students = await StudentClient.get({
                paginate: false,
                school_id: formData.school_id,
                classe_id: formData.class_id,
                category: formData.category,
                survey_id: surveyId,
                scholar_year: selectedSurvey.scholar_year
            });

            if (students && students.length > 0) {
                const studentDatas: StudentData[] = students.map((studentClass) => {
                    const foundStudent = measuredStudents.find(student => student.id === studentClass.student.id);
                    const fullName = `${studentClass.student.firstname} ${studentClass.student.lastname ?? ''}`.trim();

                    return {
                        fullname: fullName,
                        birth_date: studentClass.student.birth_date,
                        height: foundStudent?.pivot?.length ?? 0,
                        student_id: studentClass.student_id,
                        code: studentClass.student.number,
                        precedentHeight: studentClass?.precedent_height ?? null,
                        precedentWeight: studentClass?.precedent_weight ?? null,
                        weight: foundStudent?.pivot?.weight ?? 0,
                        saved: !!foundStudent,
                    };
                });

                setFormData({
                    ...formData,
                    scholar_year: selectedSurvey.scholar_year,
                    students: studentDatas
                });
            } else {
                setFormData({
                    ...formData,
                    scholar_year: selectedSurvey.scholar_year,
                    students: []
                });
            }

        } else {
            toast("Formulaire invalide", {
                type: "error"
            })
        }
    }

    return (
        <>
            <PageTitle title="Formulaire de mesure">
                <PrimaryLink permission="anthropometry.view" icon="list" to="/anthropo-measure/survey/list">
                    Liste des mesures
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form action="" method="post">
                    <div className="row mb-4">
                        <div className="col-6 mb-3">
                            {user?.school ? <Input label='Établissement' auto disabled defaultValue={user.school.name} /> : <Select
                                label='Etablissement'
                                options={schools}
                                config={{ optionKey: 'id', valueKey: 'name' }}
                                loading={SchoolRS.loading}
                                placeholder="Selectionner un école"
                                onChange={({ target }) => handleChange(target)}
                                name='school_id'
                                value={formData.school_id}
                                controlled />}
                        </div>
                        <div className="col-3 mb-3">
                            <Select
                                label='Classe'
                                options={classes}
                                config={{ optionKey: 'id', valueKey: 'name' }}
                                loading={ClassRS.loading}
                                placeholder="Selectionner une classe"
                                onChange={({ target }) => handleChange(target)}
                                name='class_id'
                                value={formData.class_id}
                                controlled />
                        </div>
                        <div className="col-3 mb-3">
                            <Select
                                label="Catégorie"
                                name="category"
                                value={formData.category}
                                options={class_categories}
                                onChange={({ target }) => handleChange(target)}
                                required={false}
                                controlled
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <SurveySelector
                                datas={surveysList}
                                surveyId={surveyId}
                                setSurveyId={setSurveyId}
                                loading={SurveyListRequestState.loading}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <Input
                                type="date"
                                label='Date de pesée'
                                onChange={({ target }) => handleChange(target)}
                                name='date'
                                value={formData.date} />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <Button permission="anthropometry.create" disabled={!isValid(formData)} loading={false} icon="check" mode="primary" onClick={getStudents}>Valider</Button>
                    </div>
                </form>
            </Block>

            {canDisplayTable() && <Block className='mt-4'>
                <table className='table table-striped table-bordered text-sm'>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th className='text-nowrap'>Nom et prénoms</th>
                            <th className='text-nowrap'>Date de naissance</th>
                            <th className='text-nowrap'>Taille Prec</th>
                            <th className='text-nowrap'>Poids Prec</th>
                            <th>Taille</th>
                            <th>Poids</th>
                            <th>Actions</th>
                            <th>État</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(SurveyRequestState.loading || StudentRequestState.loading) && <tr><td className="text-center" colSpan={9}>Chargement</td></tr>}
                        {formData.students && formData.students.map((student, index) => <tr key={index} className='align-middle'>
                            <td>{student.code}</td>
                            <td>{student.fullname}</td>
                            <td>{student.birth_date}</td>
                            <td>{student.precedentHeight ? `${student.precedentHeight} Cm` : '-'}</td>
                            <td>{student.precedentWeight ? `${student.precedentWeight} Kg` : '-'}</td>
                            <td>
                                <Input onChange={({ target }) => handleChange(target, index)} name="students.height" type='number' placeholder='Taille' value={student.height} />
                            </td>
                            <td>
                                <Input onChange={({ target }) => handleChange(target, index)} name="students.weight" type='number' placeholder='Poids' value={student.weight} />
                            </td>
                            <td className="d-flex justify-content-center align-items-center h-full">
                                <Button permission="anthropometry.create" onClick={() => saveData(index)} icon="save" mode="primary" size="sm" className="me-2" />
                                <Button permission="survey.delete" onClick={() => removeData(index)} icon="trash" mode="danger" size="sm" />
                            </td>
                            <td className="text-center">
                                {student.saved ? <span className="fw-bold text-success"><i className="bi bi-check2-all"></i></span> : <span className="fw-bold text-danger"><i className="bi bi-x-lg"></i></span>}
                            </td>
                        </tr>)}
                        {!SurveyRequestState.loading && !StudentRequestState.loading && formData.students.length <= 0 && <tr><td className="text-center" colSpan={9}>Aucune données</td></tr>}
                    </tbody>
                </table>
            </Block>}
        </>
    )
}
