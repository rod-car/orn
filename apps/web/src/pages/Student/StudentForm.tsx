import { FormEvent, useEffect, useState } from 'react'
import { Button, Input, Select } from 'ui'
import { useApi } from 'hooks'
import { config, getToken, class_categories } from '@renderer/config'
import { toast } from 'react-toastify'
import { capitalize, gender, scholar_years, ucWords } from 'functions'

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
    birth_place: '',
    father: '',
    mother: '',
    parents: '',
    school: '',
    classes: '',
    category: '',
    scholar_year: ''
}

export function StudentForm({ editedStudent }: StudentFormProps): JSX.Element {
    const [student, setStudent] = useState(defaultStudent)
    const { Client: SClient, RequestState: SRequestState, error } = useApi<typeof defaultStudent>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students'
    })

    const { Client: ScClient, datas: schools, RequestState: ScRequestState } = useApi<School>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/schools',
        key: 'data'
    })

    const { Client: ClClient, datas: ClDatas, RequestState: ClRequestState } = useApi<Classes>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/classes',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const response = editedStudent
            ? await SClient.patch(editedStudent.id, student)
            : await SClient.post(student)

        const message = editedStudent ? 'Mis à jour' : 'Enregistré'

        if (response.ok) {
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            editedStudent === undefined && setStudent(defaultStudent)
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    const getClasses = async (): Promise<Classes[]> => await ClClient.get()
    const getSchools = async (): Promise<Classes[]> => await ScClient.get()
    const getNumber = async (): Promise<void> => {
        const number = await SClient.get({}, '/get-id')
        setStudent({ ...student, number: number as unknown as number })
    }

    if (editedStudent !== undefined && student.id === 0)
        setStudent({
            id: editedStudent.id,
            number: editedStudent.number,
            firstname: editedStudent.firstname,
            lastname: editedStudent.lastname ?? '',
            gender: editedStudent.gender,
            birth_date: editedStudent.birth_date ?? '',
            birth_place: editedStudent.birth_place ?? '',
            father: editedStudent.father ?? '',
            mother: editedStudent.mother ?? '',
            parents: editedStudent.parents ?? '',
            school: editedStudent?.schools?.at(0)?.id ?? '',
            classes: editedStudent?.classes?.at(0)?.id ?? '',
            scholar_year: editedStudent?.classes?.at(0)?.pivot?.scholar_year ?? '',
            category: editedStudent?.classes?.at(0)?.pivot?.category ?? ''
        })

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement)): void => {
        let value = target.name === 'firstname' ? target.value.toUpperCase() : target.value
        value = target.name === 'lastname' ? ucWords(value) : value

        setStudent({ ...student, [target.name]: value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = null
        }
    }

    useEffect(() => {
        getClasses()
        getSchools()
        if (!editedStudent) getNumber()
    }, [])

    return (
        <form action="" onSubmit={handleSubmit} method="post" className="mb-5">
            <div className="row mb-3">
                <div className="col-xl-1">
                    <Input
                        value={editedStudent ? student.number : "Auto"}
                        onChange={({ target }): void => handleChange(target)}
                        auto
                        label="Numéro"
                        error={error?.data?.errors?.number}
                    />
                </div>
                <div className="col-xl-5">
                    <Input
                        value={student.firstname}
                        onChange={({ target }): void => handleChange(target)}
                        label="Nom"
                        name="firstname"
                        error={error?.data?.errors?.firstname}
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        value={student.lastname}
                        onChange={({ target }): void => handleChange(target)}
                        label="Prénoms"
                        name="lastname"
                        error={error?.data?.errors?.lastname}
                        required={false}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-xl-3">
                    <Select
                        value={student.gender}
                        onChange={({ target }): void => handleChange(target)}
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
                        onChange={({ target }): void => handleChange(target)}
                        type="date"
                        label="Date de naissance"
                        name="birth_date"
                        error={error?.data?.errors?.birth_date}
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        value={student.parents}
                        onChange={({ target }): void => handleChange(target)}
                        required={false}
                        label="Parents"
                        name="parents"
                        error={error?.data?.errors?.parents}
                    />
                </div>
                {/*<div className="col-xl-6">
                    <Input
                        value={student.birth_place}
                        onChange={({ target }): void => handleChange(target)}
                        label="Lieu de naissance"
                        name="birth_place"
                        error={error?.data?.errors?.birth_place}
                        required={false}
                    />
                </div>*/}
            </div>

            <div className="row mb-4">
                <div className="col-xl-3">
                    <Select
                        value={student.school}
                        onChange={({ target }): void => handleChange(target)}
                        label="Etablissement"
                        options={schools}
                        config={{ optionKey: 'id', valueKey: 'name' }}
                        name="school"
                        error={error?.data?.errors?.school}
                        loading={ScRequestState.loading}
                        controlled
                    />
                </div>
                <div className="col-xl-3">
                    <Select
                        value={student.classes}
                        onChange={({ target }): void => handleChange(target)}
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
                        onChange={({ target }): void => handleChange(target)}
                        label="Categorie"
                        options={class_categories}
                        name="category"
                        error={error?.data?.errors?.category}
                        required={false}
                        controlled
                    />
                </div>
                <div className="col-xl-3">
                    <Select
                        value={student.scholar_year}
                        onChange={({ target }): void => handleChange(target)}
                        name="scholar_year"
                        options={scholar_years()}
                        label="Année scolaire"
                        error={error?.data?.errors?.scholar_year}
                        controlled
                    />
                </div>
            </div>

            <Button
                loading={SRequestState.creating || SRequestState.updating}
                icon="save"
                type="submit"
                mode="primary"
            >
                Enregistrer
            </Button>
        </form>
    )
}
