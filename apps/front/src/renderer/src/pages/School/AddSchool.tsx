import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ApiErrorMessage, Button, Input, Select } from 'ui'
import { config } from '../../../config'
import { toast } from 'react-toastify'

const defaultSchool: School = {
    id: 0,
    localisation: '',
    commune_id: 0,
    name: '',
    responsable: '',
}

export function AddSchool(): JSX.Element {
    const [school, setSchool] = useState<School>(defaultSchool)

    const { Client, RequestState, error, resetError } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools'
    })

    const { Client: CC, datas: communes } = useApi<Commune>({
        baseUrl: config.baseUrl,
        url: '/communes'
    })

    const setName = (e: ChangeEvent<HTMLInputElement>): void => {
        setSchool({ ...school, name: e.target.value })
    }
    const setCommune = (e: ChangeEvent<HTMLSelectElement>): void => {
        setSchool({ ...school, commune_id: e.target.value as unknown as number })
    }
    const setResponsable = (e: ChangeEvent<HTMLInputElement>): void => {
        setSchool({ ...school, responsable: e.target.value })
    }
    const setLocalisation = (e: ChangeEvent<HTMLInputElement>): void => {
        setSchool({ ...school, localisation: e.target.value })
    }

    const getCommunes = async (): Promise<void> => {
        CC.get()
    }

    useEffect(() => {
        getCommunes()
    }, [])

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await Client.post(school)
        if (response.ok) {
            toast('Enregistré', {
                closeButton: true,
                type: 'success',
                position: 'bottom-right'
            })
            setSchool(defaultSchool)
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: 'bottom-right'
            })
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Ajouter un établissement</h1>
                <NavLink to="/school/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des établissements
                </NavLink>
            </div>

            {error && (
                <ApiErrorMessage
                    className="mb-3"
                    message={error.message}
                    onClose={(): void => {
                        resetError()
                    }}
                />
            )}

            <form className="mb-5" action="" onSubmit={handleSubmit} method="post">
                <div className="row mb-3">
                    <div className="col-xl-6">
                        <Input
                            label="Nom de l'établissement"
                            onChange={setName}
                            value={school.name}
                            controlled
                        />
                    </div>
                    <div className="col-xl-6">
                        <Select
                            onChange={setCommune}
                            value={school.commune_id}
                            label="Commune"
                            options={communes}
                            config={{ valueKey: 'name', optionKey: 'id' }}
                            controlled
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-xl-6">
                        <Input
                            label="Responsable"
                            onChange={setResponsable}
                            value={school.responsable}
                            required={false}
                            controlled
                        />
                    </div>
                    <div className="col-xl-6">
                        <Input
                            label="Adresse"
                            onChange={setLocalisation}
                            value={school.localisation}
                            controlled
                        />
                    </div>
                </div>

                <Button type="submit" icon="save" mode="primary" loading={RequestState.creating}>
                    Enregistrer
                </Button>
            </form>
        </>
    )
}
