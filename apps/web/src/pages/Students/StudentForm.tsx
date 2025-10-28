/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { Input, PrimaryButton, Select } from 'ui'
import { useApi, useAuthStore } from 'hooks'
import { config, class_categories } from '@base/config'
import { toast } from '@base/ui';
import { gender, ucWords } from 'functions'
import { ScholarYearSelectorServer } from '@base/components/index.ts'
import { confirmAlert } from 'react-confirm-alert'

type StudentFormProps = {
    editedStudent?: Student
}

const defaultStudent = {
    id: 0,
    number: 0,
    firstname: '',
    lastname: '',
    gender: 'Garçon',
    birth_date: '',
    father: '',
    mother: '',
    parents: '',
    school: '',
    classes: '',
    category: '',
    scholar_year: 0
}

export function StudentForm({ editedStudent }: StudentFormProps): ReactNode {
    const [student, setStudent] = useState<Partial<typeof defaultStudent>>(defaultStudent)
    const [scholarYear, setScholarYear] = useState<string | number>(defaultStudent.scholar_year)

    const { Client: SClient, RequestState: SRequestState, error } = useApi<typeof defaultStudent>({
        url: '/students'
    })

    const { Client: ScClient, datas: schools, RequestState: ScRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: ClClient, datas: ClDatas, RequestState: ClRequestState } = useApi<Classes>({
        url: '/classes',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous enregistrer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const data = { ...student, scholar_year: scholarYear as number }

                        setStudent(data)

                        const response = editedStudent
                            ? await SClient.patch(editedStudent.id, data)
                            : await SClient.post(data)

                        const message = editedStudent ? "Mis à jour" : "Enregistré"

                        if (response.ok) {
                            toast(message, {
                                closeButton: true,
                                type: 'success'
                            })
                            if (editedStudent === undefined) {
                                setStudent({
                                    ...defaultStudent,
                                    scholar_year: data.scholar_year,
                                    school: data.school,
                                    classes: data.classes,
                                    category: data.category,
                                    gender: data.gender
                                })
                            }
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'info'
                        })
                }
            ]
        })
    }

    const { user } = useAuthStore()

    const getClasses = async (): Promise<Classes[]> => await ClClient.get()
    const getSchools = async (): Promise<void> => {
        await ScClient.get()
        if (user?.school) {
            const schoolId = user.school.id.toString();
            setStudent({...student, school: schoolId})
        }
    }
    const getNumber = async (): Promise<void> => {
        const number = await SClient.get({}, '/get-id')
        setStudent({ ...student, number: number as unknown as number })
    }

    if (editedStudent !== undefined && student.id === 0) {
        setStudent({
            id: editedStudent.id,
            number: editedStudent.number,
            firstname: editedStudent.firstname,
            lastname: editedStudent.lastname ?? '',
            gender: editedStudent.gender,
            birth_date: editedStudent.birth_date ?? '',
            father: editedStudent.father ?? '',
            mother: editedStudent.mother ?? '',
            parents: editedStudent.parents ?? '',
        })
    }

    /**
     * Permet de mettre a jour les champs
     */
    const handleChange = useCallback(({ target }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let value = target.name === 'firstname' ? target.value.toUpperCase() : target.value
        value = target.name === 'lastname' ? ucWords(value) : value

        setStudent({ ...student, [target.name]: value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = []
        }
    }, [setStudent, student, error])

    useEffect(() => {
        const getData = async () => {
            await getClasses()
            await getSchools()
        }

        getData()
        if (!editedStudent) getNumber()
    }, [])

    return (
        <form onSubmit={handleSubmit} method="post">
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Input
                        value={student.firstname}
                        onChange={handleChange}
                        label="Nom"
                        name="firstname"
                        placeholder="Nom de l'étudiant"
                        error={error?.data?.errors?.firstname}
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        value={student.lastname}
                        onChange={handleChange}
                        label="Prénoms"
                        name="lastname"
                        placeholder="Prénoms de l'étudiant (Fac)"
                        error={error?.data?.errors?.lastname}
                        required={false}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-xl-3">
                    <Select
                        value={student.gender}
                        onChange={handleChange}
                        label="Sexe"
                        name="gender"
                        placeholder={null}
                        options={gender}
                        error={error?.data?.errors?.gender}
                        controlled
                    />
                </div>
                <div className="col-xl-3">
                    <Input
                        value={student.birth_date}
                        onChange={handleChange}
                        type="date"
                        label="Date de naissance"
                        name="birth_date"
                        error={error?.data?.errors?.birth_date}
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        value={student.parents}
                        onChange={handleChange}
                        required={false}
                        label="Nom des parents"
                        name="parents"
                        placeholder="Nom du Père & Nom de la mère"
                        error={error?.data?.errors?.parents}
                    />
                </div>
            </div>

            {editedStudent === undefined && <div className="row mb-4">
                <div className="col-xl-3">
                    {user?.school ? <Input label='Établissement' auto disabled defaultValue={user.school.name} /> : <Select
                        value={student.school}
                        onChange={handleChange}
                        label="Etablissement"
                        options={schools}
                        config={{ optionKey: 'id', valueKey: 'name' }}
                        name="school"
                        error={error?.data?.errors?.school}
                        loading={ScRequestState.loading}
                        controlled
                    />}
                </div>
                <div className="col-xl-3">
                    <Select
                        value={student.classes}
                        onChange={handleChange}
                        label="Classe"
                        options={ClDatas}
                        config={{ optionKey: 'id', valueKey: 'name' }}
                        name="classes"
                        error={error?.data?.errors?.classes}
                        loading={ClRequestState.loading}
                        controlled
                    />
                </div>
                <div className="col-xl-3">
                    <Select
                        value={student.category}
                        onChange={handleChange}
                        label="Categorie"
                        options={class_categories}
                        name="category"
                        error={error?.data?.errors?.category}
                        required={false}
                        controlled
                    />
                </div>

                <div className="col-xl-3">
                    <ScholarYearSelectorServer
                        label="Année scolaire"
                        scholarYear={scholarYear}
                        setScholarYear={setScholarYear}
                    />
                </div>
            </div>}

            <PrimaryButton
                permission="student.create"
                loading={SRequestState.creating || SRequestState.updating}
                icon="save"
                type="submit"
            >Enregistrer</PrimaryButton>
        </form>
    )
}
