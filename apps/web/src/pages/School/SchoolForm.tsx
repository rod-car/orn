/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, useEffect, useState } from 'react'
import { Button, Input, PrimaryButton, Select } from 'ui'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'

type SchoolFormProps = {
    editedSchool?: School
}

const defaultSchool: School = {
    id: 0,
    name: '',
    commune_id: 0,
    localisation: '',
    responsable: ''
}

export function SchoolForm({ editedSchool }: SchoolFormProps): ReactNode {
    const [school, setSchool] = useState(defaultSchool)
    const { Client: SchoolClient, error, RequestState } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const { Client: CommuneClient, datas: communes } = useApi<Commune>({
        baseUrl: config.baseUrl,
        url: '/communes'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = editedSchool
            ? await SchoolClient.patch(editedSchool.id, school)
            : await SchoolClient.post(school)

        const message = editedSchool ? 'Mis à jour' : 'Enregistré'

        if (response.ok) {
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            editedSchool === undefined && setSchool(defaultSchool)
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    const getCommunes = async (): Promise<Commune[]> => await CommuneClient.get()

    if (editedSchool !== undefined && school.id === 0)
        setSchool({
            ...editedSchool,
            commune_id: editedSchool.commune_id ?? 0,
            localisation: editedSchool.localisation ?? '',
            responsable: editedSchool.responsable ?? ''
        })

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement)): void => {
        setSchool({ ...school, [target.name]: target.value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = null
        }
    }

    useEffect(() => {
        getCommunes()
    }, [])

    return (
        <form action="#" onSubmit={handleSubmit} method="post">
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Input
                        label="Nom de l'établissement"
                        value={school.name}
                        error={error?.data?.errors?.name}
                        onChange={({ target }): void => handleChange(target)}
                        name="name"
                    />
                </div>
                <div className="col-xl-6">
                    <Select
                        controlled
                        name="commune_id"
                        label="Commune"
                        options={communes}
                        value={school.commune_id}
                        error={error?.data?.errors?.commune_id}
                        config={{ optionKey: 'id', valueKey: 'name' }}
                        onChange={({ target }): void => handleChange(target)}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Input
                        label="Responsable"
                        value={school.responsable}
                        error={error?.data?.errors?.responsable}
                        onChange={({ target }): void => handleChange(target)}
                        name="responsable"
                        required={false}
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        label="Adresse"
                        value={school.localisation}
                        error={error?.data?.errors?.localisation}
                        onChange={({ target }): void => handleChange(target)}
                        name="localisation"
                    />
                </div>
            </div>

            <PrimaryButton
                loading={RequestState.creating || RequestState.updating}
                icon="save"
                type="submit"
            >Enregistrer</PrimaryButton>
        </form>
    )
}
