/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { toast } from 'react-toastify'
import { config } from '@renderer/config'
import { Block, Button, Checkbox } from 'ui'
import { confirmAlert } from 'react-confirm-alert'
import { format, scholar_years, in_array } from 'functions'
import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { ClassSelector, Link, ScholarYearSelector, SchoolSelector, TableLoading } from '@renderer/components'

export function StudentsClasses(): ReactNode {
    const [schoolId, setSchoolId] = useState(0)
    const [actualClassId, setActualClassId] = useState(0)
    const [nextClassId, setNextClassId] = useState(0)
    const [actualScholarYear, setActualScholarYear] = useState(scholar_years().at(1) as string)
    const [nextScholarYear, setNextScholarYear] = useState(scholar_years().at(0) as string)
    const [studentsClasses, setStudentsClasses] = useState<number[]>([])

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassesClient, datas: classes, RequestState: ClassesRequestState } = useApi<Classes>({
        baseUrl: config.baseUrl,
        url: '/classes',
        key: 'data'
    })

    const { Client: StudentClient, datas: students, setDatas: setStudents, RequestState: StudentRequestState } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students',
        key: 'data'
    })

    useEffect(() => {
        SchoolClient.get()
        ClassesClient.get()
    }, [])

    useEffect(() => {
        if (schoolId !== 0 && actualScholarYear !== "" && actualClassId !== 0) {
            StudentClient.get({
                paginate: false,
                school_id: schoolId,
                classe_id: actualClassId,
                scholar_year: actualScholarYear
            })
        }
    }, [schoolId, actualScholarYear, actualClassId])

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
        return (nextClassId !== 0 && nextClassId !== actualClassId) && (nextScholarYear !== '' && nextScholarYear !== actualScholarYear)
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="text-primary fw-semibold">Ajouter un étudiant</h2>
                <Link to="/anthropo-measure/student/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </div>

            <Block>
                <form onSubmit={handleSubmit} action="" method="post">
                    <div className="row mb-3">
                        <div className="col-6">
                            <SchoolSelector
                                datas={schools}
                                schoolId={schoolId}
                                loading={SchoolRequestState.loading}
                                setSchoolId={setSchoolId}/>
                        </div>
                        <div className="col-3">
                            <ClassSelector
                                label="Classe actuel"
                                datas={classes}
                                classId={actualClassId}
                                loading={ClassesRequestState.loading}
                                setClassId={setActualClassId}/>
                        </div>
                        <div className="col-3">
                            <ClassSelector
                                label="Classe suivante"
                                datas={classes}
                                classId={nextClassId}
                                loading={ClassesRequestState.loading}
                                setClassId={setNextClassId}/>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-6">
                            <ScholarYearSelector
                                label="Année scolaire actuel"
                                scholarYear={actualScholarYear}
                                setScholarYear={setActualScholarYear} />
                        </div>
                        <div className="col-6">
                            <ScholarYearSelector
                                label="Année scolaire suivant"
                                scholarYear={nextScholarYear}
                                setScholarYear={setNextScholarYear} />
                        </div>
                    </div>

                    <div className="mb-5">
                        <h4 className='fw-bold mb-5'>Liste des étudiants</h4>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Nom et prénoms</th>
                                    <th>Date de naissance</th>
                                    <th>Sexe</th>
                                    <th>Admis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {StudentRequestState.loading && <TableLoading cols={5} rows={10} />}
                                {students && students.map((studentClass, index) => <tr key={studentClass.id}>
                                    <td>{index + 1}</td>
                                    <td>{studentClass.student.firstname} {studentClass.student.lastname}</td>
                                    <td>{format(studentClass.student.birth_date, "dd/MM/y")}</td>
                                    <td>{studentClass.student.gender}</td>
                                    <td className="d-flex">
                                        {canDisplayCheckbox() && <Checkbox
                                            className="me-2"
                                            mode="primary"
                                            checked={in_array(studentsClasses, studentClass.student_id)}
                                            onCheck={() => handleStudentCheck(studentClass.student_id)}
                                            label="Admis" />}
                                        <Button
                                            type="button"
                                            icon="trash"
                                            mode="danger"
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

                    {studentsClasses.length > 0 && <Button
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
