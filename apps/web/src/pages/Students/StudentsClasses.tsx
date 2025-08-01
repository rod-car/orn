/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { toast } from 'react-toastify'
import { class_categories, config } from '@base/config'
import { Block, Button, Checkbox, DangerButton, Input, PageTitle, Select } from 'ui'
import { confirmAlert } from 'react-confirm-alert'
import { format, in_array } from 'functions'
import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { ClassSelector, PrimaryLink, ScholarYearSelectorServer, SchoolSelector, TableLoading } from '@base/components'

export function StudentsClasses(): ReactNode {
    const [schoolId, setSchoolId] = useState(0)
    const [actualClassId, setActualClassId] = useState(0)
    const [nextClassId, setNextClassId] = useState(0)

    const [actualCategory, setActualCategory] = useState<string>('')
    const [nextCategory, setNextCategory] = useState<string>('')

    const [actualScholarYear, setActualScholarYear] = useState<string | number>(0)
    const [nextScholarYear, setNextScholarYear] = useState<string | number>(0)
    const [studentsClasses, setStudentsClasses] = useState<number[]>([])

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassesClient, datas: classes, RequestState: ClassesRequestState } = useApi<Classes>({
        url: '/classes',
        key: 'data'
    })

    const { Client: StudentClient, datas: students, setDatas: setStudents, RequestState: StudentRequestState } = useApi<Student>({
        url: '/students',
        key: 'data'
    })

    const { Client: NextStudentClient } = useApi<Student>({
        url: '/students',
        key: 'data'
    })

    const {user} = useAuthStore()

    useEffect(() => {
        if (user?.school) setSchoolId(user.school.id)
        SchoolClient.get()
        ClassesClient.get()
    }, [])

    const changeCategory = async ({target}: ChangeEvent<HTMLSelectElement>) => {
        const { value, name } = target
        if (name === 'actual_category') setActualCategory(value)
        else setNextCategory(value)
    }

    const getActualStudentClasses = useCallback(async () => {
        if (schoolId !== 0 && actualScholarYear !== 0 && actualClassId !== 0) {
            await StudentClient.get({
                paginate: false,
                school_id: schoolId,
                classe_id: actualClassId,
                scholar_year: actualScholarYear,
                category: actualCategory
            })
        }
    }, [schoolId, actualScholarYear, actualClassId, actualCategory])

    const getNextStudentClasses = useCallback(async () => {
        if (schoolId !== 0 && nextScholarYear !== 0 && nextClassId !== 0) {
            const response = await NextStudentClient.get({
                paginate: false,
                school_id: schoolId,
                classe_id: nextClassId,
                scholar_year: nextScholarYear,
                category: nextCategory
            })

            if (response.length) {
                const studentIds = response.map((student: Student) => student.student_id)
                setStudentsClasses(studentIds)
            }
        }
    }, [schoolId, nextScholarYear, nextClassId, nextCategory])

    useEffect(() => {
        getActualStudentClasses()
    }, [schoolId, actualScholarYear, actualClassId, actualCategory])

    useEffect(() => {
        getNextStudentClasses()
    }, [schoolId, nextScholarYear, nextClassId, nextCategory])

    /**
     * Traiter si un étudiant est selectionné
     * @param studentId 
     */
    function handleStudentCheck(studentId: number) {
        if (in_array(studentsClasses, studentId)) {
            studentsClasses.splice(studentsClasses.indexOf(studentId), 1)
        } else {
            studentsClasses.push(studentId)
        }

        setStudentsClasses([...studentsClasses])
    }

    /**
     * Generer les parametres de la requête
     * @param addParams Parametres additionnel
     * @returns 
     */
    function getParams(addParams: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            students: studentsClasses,
            old_class: actualClassId,
            next_class: nextClassId,
            old_syear: actualScholarYear,
            next_syear: nextScholarYear,
            school: schoolId,
            old_category: actualCategory,
            next_category: nextCategory,
            ...addParams
        }
    }

    /**
     * Permet de traiter la soumission du formumlaire
     * @param e FormEvent
     */
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const response = await StudentClient.post(getParams(), '/update-classes')

        if (response.ok) {
            toast("Enregistré", { position: config.toastPosition, type: 'success' })
            setActualScholarYear(nextScholarYear)
            setNextScholarYear('')

            setActualClassId(nextClassId)
            setNextClassId(0)

            setStudentsClasses([])
        } else {
            toast("Erreur de soumission", { position: config.toastPosition, type: 'error' })
        }
    }

    /**
     * Retire un étudiant dans un classe particulier dans une année scolaire
     * @param studentId 
     */
    async function removeStudent(studentId: number) {
        confirmAlert({
            title: 'Question',
            message: `Retirer cet étudiant pour ${actualScholarYear} ?`,
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await StudentClient.post(getParams(), `/remove-student-class/${studentId}`)

                        if (response.ok) {
                            toast('Retiré', {
                                type: 'success',
                                position: config.toastPosition
                            })
                        } else {
                            toast('Impossible de retirer', {
                                type: 'error',
                                position: config.toastPosition
                            })
                        }

                        const temp = students.filter(student => student.student_id !== studentId)
                        setStudents(temp)
                    }
                },
                {
                    label: 'Non',
                    onClick: () => toast('Annulé', {
                        type: 'info',
                        position: config.toastPosition
                    })
                }
            ]
        })
    }

    /**
     * Permet de determiner si on doit afficher la checkbox
     * @returns 
     */
    function canDisplayCheckbox(): boolean {
        return (nextClassId !== 0 
                && (nextClassId !== actualClassId || (nextClassId === actualClassId && actualCategory !== nextCategory))
            )
            && (nextScholarYear !== 0 && nextScholarYear !== actualScholarYear)
    }

    return (
        <>
            <PageTitle title="Mise à jour des classes des étudiants">
                <PrimaryLink permission="student.view" to="/anthropo-measure/student/list" icon="list">
                    Liste des étudiants
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form onSubmit={handleSubmit} action="" method="post">
                    <div className="row mb-3">
                        <div className="col-12">
                        {user?.school ? <Input label='Établissement' auto disabled defaultValue={user.school.name} /> : <SchoolSelector
                                datas={schools}
                                schoolId={schoolId}
                                loading={SchoolRequestState.loading}
                                setSchoolId={setSchoolId}
                            />}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-3">
                            <ClassSelector
                                label="Classe actuel"
                                datas={classes}
                                classId={actualClassId}
                                loading={ClassesRequestState.loading}
                                setClassId={setActualClassId}/>
                        </div>
                        <div className="col-3">
                            <Select
                                label="Catégorie"
                                name="actual_category"
                                value={actualCategory}
                                options={class_categories}
                                onChange={changeCategory}
                                required={false}
                                controlled
                            />
                        </div>

                        <div className="col-3">
                            <ClassSelector
                                label="Classe suivante"
                                datas={classes}
                                classId={nextClassId}
                                loading={ClassesRequestState.loading}
                                setClassId={setNextClassId}/>
                        </div>
                        <div className="col-3">
                            <Select
                                label="Catégorie"
                                name="next_category"
                                value={nextCategory}
                                options={class_categories}
                                onChange={changeCategory}
                                required={false}
                                controlled
                            />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-6">
                            <ScholarYearSelectorServer
                                label="Année scolaire actuel"
                                scholarYear={actualScholarYear}
                                setScholarYear={setActualScholarYear}
                            />
                        </div>
                        <div className="col-6">
                            <ScholarYearSelectorServer
                                label="Année scolaire suivant"
                                scholarYear={nextScholarYear}
                                setScholarYear={setNextScholarYear}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="mb-3">
                        <h6 className='fw-bold mb-3 text-primary'>Liste des étudiants dans cette classe</h6>
                        <hr />
                        <table className='table table-bordered text-sm'>
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Nom et prénoms</th>
                                    <th>Date de naissance</th>
                                    <th>Sexe</th>
                                    <th className="w-15">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {StudentRequestState.loading && <TableLoading cols={5} rows={10} />}
                                {students && students.map((studentClass, index) => <tr key={studentClass.id}>
                                    <td>{index + 1}</td>
                                    <td>{studentClass.student.firstname} {studentClass.student.lastname}</td>
                                    <td>{studentClass.student.birth_date && format(studentClass.student.birth_date, "dd/MM/y")}</td>
                                    <td>{studentClass.student.gender}</td>
                                    <td className="d-flex">
                                        {canDisplayCheckbox() && <Checkbox
                                            className="me-3 border-1"
                                            mode="primary"
                                            checked={in_array(studentsClasses, studentClass.student_id)}
                                            onCheck={() => handleStudentCheck(studentClass.student_id)}
                                            label="Admis" />}
                                        <DangerButton
                                            permission="student.delete"
                                            icon="trash"
                                            size="sm"
                                            onClick={() => removeStudent(studentClass.student_id)}
                                        />
                                    </td>
                                </tr>)}

                                {!StudentRequestState.loading && students.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            Aucune données
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {studentsClasses.length > 0 && canDisplayCheckbox() && <Button
                        permission="student.update-class"
                        type="submit"
                        mode="primary"
                        icon="check"
                        disabled={StudentRequestState.loading}
                        loading={StudentRequestState.creating}>Valider</Button>}
                </form>
            </Block>
        </>
    )
}
