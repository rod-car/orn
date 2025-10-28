/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { toast } from '@base/ui';
import { class_categories, config } from '@base/config'
import { Block, Button, Checkbox, DangerButton, Input, PageTitle, Select } from 'ui'
import { confirmAlert } from 'react-confirm-alert'
import { format } from 'functions'
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState, useRef } from 'react'
import { ClassSelector, PrimaryLink, ScholarYearSelectorServer, SchoolSelector, TableLoading } from '@base/components'

export function StudentsClasses(): ReactNode {
    // States principaux
    const [schoolId, setSchoolId] = useState(0)
    const [actualClassId, setActualClassId] = useState(0)
    const [nextClassId, setNextClassId] = useState(0)
    const [actualCategory, setActualCategory] = useState<string>('')
    const [nextCategory, setNextCategory] = useState<string>('')
    const [actualScholarYear, setActualScholarYear] = useState<string | number>(0)
    const [nextScholarYear, setNextScholarYear] = useState<string | number>(0)
    const [studentsClasses, setStudentsClasses] = useState<number[]>([])
    
    // State pour gérer le loading de la soumission
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Refs pour gérer les annulations
    const abortControllerRef = useRef<AbortController | null>(null)
    const nextAbortControllerRef = useRef<AbortController | null>(null)

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

    const { user } = useAuthStore()

    // Initialisation
    useEffect(() => {
        if (user?.school) setSchoolId(user.school.id)
        
        SchoolClient.get().catch(err => {
            console.error('Error loading schools:', err)
            toast("Erreur de chargement des établissements", { type: 'error' })
        })
        
        ClassesClient.get().catch(err => {
            console.error('Error loading classes:', err)
            toast("Erreur de chargement des classes", { type: 'error' })
        })

        // Cleanup lors du démontage
        return () => {
            abortControllerRef.current?.abort()
            nextAbortControllerRef.current?.abort()
        }
    }, [])

    /**
     * Gestion du changement de catégorie
     */
    const changeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value, name } = e.target
        if (name === 'actual_category') {
            setActualCategory(value)
        } else {
            setNextCategory(value)
        }
    }

    /**
     * Récupération des étudiants de la classe actuelle
     */
    useEffect(() => {
        const fetchActualStudents = async () => {
            if (schoolId === 0 || actualScholarYear === 0 || actualClassId === 0) {
                setStudents([])
                return
            }

            // Annuler la requête précédente si elle existe
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            abortControllerRef.current = new AbortController()

            try {
                await StudentClient.get({
                    paginate: false,
                    school_id: schoolId,
                    classe_id: actualClassId,
                    scholar_year: actualScholarYear,
                    category: actualCategory
                })
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Error loading students:', error)
                    toast("Erreur de chargement des étudiants", { type: 'error' })
                }
            }
        }

        fetchActualStudents()
    }, [schoolId, actualScholarYear, actualClassId, actualCategory])

    /**
     * Récupération des étudiants de la classe suivante (pour pré-cocher uniquement ceux qui viennent de la classe actuelle)
     */
    useEffect(() => {
        const fetchNextStudents = async () => {
            if (schoolId === 0 || nextScholarYear === 0 || nextClassId === 0) {
                // Réinitialiser la sélection quand on change de classe suivante
                setStudentsClasses([])
                return
            }

            // Annuler la requête précédente si elle existe
            if (nextAbortControllerRef.current) {
                nextAbortControllerRef.current.abort()
            }
            nextAbortControllerRef.current = new AbortController()

            try {
                const response = await NextStudentClient.get({
                    paginate: false,
                    school_id: schoolId,
                    classe_id: nextClassId,
                    scholar_year: nextScholarYear,
                    category: nextCategory
                })

                if (Array.isArray(response) && response.length > 0) {
                    // Récupérer les IDs des étudiants de la classe suivante
                    const nextStudentIds = response
                        .filter((student: Student) => student.student_id)
                        .map((student: Student) => student.student_id as number)
                    
                    // Ne pré-cocher QUE les étudiants qui existent aussi dans la classe actuelle
                    const currentStudentIds = students
                        .filter(s => s.student?.id)
                        .map(s => s.student_id as number)
                    
                    // Intersection : étudiants présents dans BOTH les deux classes
                    const commonStudents = nextStudentIds.filter(id => currentStudentIds.includes(id))
                    
                    setStudentsClasses(commonStudents)
                } else {
                    setStudentsClasses([])
                }
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Error loading next students:', error)
                    setStudentsClasses([])
                }
            }
        }

        fetchNextStudents()
    }, [schoolId, nextScholarYear, nextClassId, nextCategory, students])

    /**
     * Gestion de la sélection d'un étudiant (sans mutation)
     */
    function handleStudentCheck(studentId: number) {
        if (!studentsClasses.includes(studentId)) {
            toast(`Étudiant id: ${studentId} sélectionné`, {
                type: 'success',
            })
        }

        setStudentsClasses(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId)
            }
            return [...prev, studentId]
        })
    }

    /**
     * Génération des paramètres de la requête
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
     * Validation du formulaire avant soumission
     */
    function validateForm(): boolean {
        if (studentsClasses.length === 0) {
            toast("Veuillez sélectionner au moins un étudiant", { type: 'warning' })
            return false
        }

        if (schoolId === 0) {
            toast("Veuillez sélectionner un établissement", { type: 'warning' })
            return false
        }

        if (actualClassId === 0 || nextClassId === 0) {
            toast("Veuillez sélectionner les classes", { type: 'warning' })
            return false
        }

        if (actualScholarYear === 0 || nextScholarYear === 0) {
            toast("Veuillez sélectionner les années scolaires", { type: 'warning' })
            return false
        }

        // Validation que l'année suivante est différente de l'actuelle
        if (actualScholarYear === nextScholarYear) {
            toast("L'année scolaire suivante doit être différente de l'actuelle", { type: 'warning' })
            return false
        }

        return true
    }

    /**
     * Soumission du formulaire avec gestion d'erreur complète
     */
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        confirmAlert({
            title: 'Confirmation',
            message: `Voulez-vous déplacer ${studentsClasses.length} étudiant(s) vers la nouvelle classe ?`,
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        setIsSubmitting(true)
                        try {
                            const response = await StudentClient.post(getParams(), '/update-classes')

                            if (response.ok) {
                                toast("Classes mises à jour avec succès", { 
                                     
                                    type: 'success' 
                                })
                                
                                // Réinitialisation intelligente
                                setActualScholarYear(nextScholarYear)
                                setActualClassId(nextClassId)
                                setActualCategory(nextCategory)
                                
                                setNextScholarYear(0)
                                setNextClassId(0)
                                setNextCategory('')
                                setStudentsClasses([])
                            } else {
                                const errorMsg = response?.message || "Erreur lors de la mise à jour"
                                toast(errorMsg, {  type: 'error' })
                            }
                        } catch (error: any) {
                            console.error('Submit error:', error)
                            toast("Erreur réseau lors de la soumission", { 
                                 
                                type: 'error' 
                            })
                        } finally {
                            setIsSubmitting(false)
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () => toast('Opération annulée', {
                        closeButton: true,
                        type: 'info',
                    })
                }
            ]
        })
    }

    /**
     * Retrait d'un étudiant avec gestion d'erreur
     */
    async function removeStudent(studentId: number) {
        const student = students.find(s => s.student_id === studentId)
        const studentName = student?.student ? `${student.student.firstname} ${student.student.lastname}` : 'cet étudiant'

        confirmAlert({
            title: 'Confirmation de retrait',
            message: `Êtes-vous sûr de vouloir retirer ${studentName} de la classe ${actualScholarYear} ?`,
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        try {
                            const response = await StudentClient.post(
                                getParams(), 
                                `/remove-student-class/${studentId}`
                            )

                            if (response.ok) {
                                toast('Étudiant retiré avec succès', {
                                    type: 'success'
                                })
                                
                                // Mise à jour optimiste de l'UI
                                const temp = students.filter(s => s.student_id !== studentId)
                                setStudents(temp)
                                
                                // Retirer aussi de la sélection si présent
                                setStudentsClasses(prev => prev.filter(id => id !== studentId))
                            } else {
                                const errorMsg = response?.message || "Impossible de retirer l'étudiant"
                                toast(errorMsg, {
                                    type: 'error'
                                })
                            }
                        } catch (error: any) {
                            console.error('Remove student error:', error)
                            toast("Erreur réseau lors du retrait", {
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () => toast('Opération annulée', {
                        type: 'info',
                    })
                }
            ]
        })
    }

    /**
     * Détermine si on doit afficher la checkbox
     */
    function canDisplayCheckbox(): boolean {
        const hasNextClass = nextClassId !== 0
        const hasNextYear = nextScholarYear !== 0 && nextScholarYear !== actualScholarYear
        const isDifferentClass = nextClassId !== actualClassId || 
                                 (nextClassId === actualClassId && actualCategory !== nextCategory)
        
        return hasNextClass && hasNextYear && isDifferentClass
    }

    /**
     * Filtre et valide les étudiants
     */
    const validStudents = students.filter(studentClass => {
        if (!studentClass.student) {
            console.warn('Student class without student:', studentClass.id)
            return false
        }
        return true
    })

    return (
        <>
            <PageTitle title="Mise à jour des classes des étudiants">
                <PrimaryLink permission="student.view" to="/anthropo-measure/student/list" icon="list">
                    Liste des étudiants
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form onSubmit={handleSubmit} method="post">
                    {/* Section Établissement */}
                    <div className="row mb-3">
                        <div className="col-12">
                            {user?.school ? (
                                <Input 
                                    label='Établissement' 
                                    auto 
                                    disabled 
                                    defaultValue={user.school.name} 
                                />
                            ) : (
                                <SchoolSelector
                                    datas={schools}
                                    schoolId={schoolId}
                                    loading={SchoolRequestState.loading}
                                    setSchoolId={setSchoolId}
                                />
                            )}
                        </div>
                    </div>

                    {/* Section Classes et Catégories */}
                    <div className="row mb-3">
                        <div className="col-3">
                            <ClassSelector
                                label="Classe actuelle"
                                datas={classes}
                                classId={actualClassId}
                                loading={ClassesRequestState.loading}
                                setClassId={setActualClassId}
                            />
                        </div>
                        <div className="col-3">
                            <Select
                                label="Catégorie actuelle"
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
                                setClassId={setNextClassId}
                            />
                        </div>
                        <div className="col-3">
                            <Select
                                label="Catégorie suivante"
                                name="next_category"
                                value={nextCategory}
                                options={class_categories}
                                onChange={changeCategory}
                                required={false}
                                controlled
                            />
                        </div>
                    </div>

                    {/* Section Années Scolaires */}
                    <div className="row mb-4">
                        <div className="col-6">
                            <ScholarYearSelectorServer
                                label="Année scolaire actuelle"
                                scholarYear={actualScholarYear}
                                setScholarYear={setActualScholarYear}
                            />
                        </div>
                        <div className="col-6">
                            <ScholarYearSelectorServer
                                label="Année scolaire suivante"
                                scholarYear={nextScholarYear}
                                setScholarYear={setNextScholarYear}
                            />
                        </div>
                    </div>

                    <hr />

                    {/* Section Liste des étudiants */}
                    <div className="mb-3">
                        <h6 className='fw-bold mb-3 text-primary'>
                            Liste des étudiants dans cette classe
                            {validStudents.length > 0 && ` (${validStudents.length})`}
                        </h6>
                        <hr />
                        <div className="table-responsive">
                            <table className='table table-bordered table-hover text-sm'>
                                <thead className='table-light'>
                                    <tr>
                                        <th className="text-center">N°</th>
                                        <th>Code</th>
                                        <th>Nom et prénoms</th>
                                        <th>Date de naissance</th>
                                        <th className="text-center">Sexe</th>
                                        <th className="text-center w-15">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {StudentRequestState.loading && <TableLoading cols={6} rows={10} />}

                                    {!StudentRequestState.loading && validStudents.length > 0 && validStudents.map((studentClass, index) => (
                                        <tr key={studentClass.id} onClick={() => handleStudentCheck(studentClass.student_id as number)}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{studentClass.student.number}</td>
                                            <td>
                                                {studentClass.student.firstname} {studentClass.student.lastname}
                                            </td>
                                            <td>
                                                {studentClass.student.birth_date 
                                                    ? format(studentClass.student.birth_date, "dd/MM/y")
                                                    : '-'
                                                }
                                            </td>
                                            <td className="text-center">{studentClass.student.gender || '-'}</td>
                                            <td className="d-flex justify-content-center align-items-center">
                                                {canDisplayCheckbox() && (
                                                    <Checkbox
                                                        className="me-3 border-1"
                                                        mode="primary"
                                                        checked={studentsClasses.includes(studentClass.student_id as number)}
                                                        onCheck={() => handleStudentCheck(studentClass.student_id as number)}
                                                        label="Admis"
                                                    />
                                                )}
                                                <DangerButton
                                                    permission="student.delete"
                                                    icon="trash"
                                                    size="sm"
                                                    onClick={() => removeStudent(studentClass.student_id as number)}
                                                    title="Retirer l'étudiant"
                                                />
                                            </td>
                                        </tr>
                                    ))}

                                    {!StudentRequestState.loading && validStudents.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center text-muted py-4">
                                                {actualClassId === 0 || actualScholarYear === 0
                                                    ? 'Veuillez sélectionner une classe et une année scolaire'
                                                    : 'Aucun étudiant trouvé dans cette classe'
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bouton de validation */}
                    {studentsClasses.length > 0 && canDisplayCheckbox() && (
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">
                                {studentsClasses.length} étudiant(s) sélectionné(s)
                            </span>
                            <Button
                                permission="student.update-class"
                                type="submit"
                                mode="primary"
                                icon="check"
                                disabled={StudentRequestState.loading || isSubmitting}
                                loading={isSubmitting}
                            >
                                Valider le passage en classe supérieure
                            </Button>
                        </div>
                    )}
                </form>
            </Block>
        </>
    )
}