import { FormEvent, useEffect } from 'react'
import { Block, Button, Input, Select } from 'ui'
import { Link } from 'react-router-dom'
import { useApi } from 'hooks'
import { config } from '../../../config'
import { toast } from 'react-toastify'
import { gender, scholar_years } from 'functions'

export function AddStudent(): JSX.Element {
    const {
        Client: SClient,
        RequestState: SRequestState,
        error
    } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students'
    })

    const { Client: ScClient, datas: ScDatas } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const { Client: ClClient, datas: ClDatas } = useApi<Classes>({
        baseUrl: config.baseUrl,
        url: '/classes',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const response = await SClient.post(formData)

        if (response.ok) {
            toast('Enregistré', {
                closeButton: true,
                type: 'success',
                position: 'bottom-right'
            })
            form.reset()
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: 'bottom-right'
            })
        }
    }

    const getClasses = async (): Promise<void> => await ClClient.get()
    const getSchools = async (): Promise<void> => await ScClient.get()

    useEffect(() => {
        getClasses()
        getSchools()
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="text-muted">Ajouter un étudiant</h2>
                <Link to="/student/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </div>

            <Block>
                <form action="" onSubmit={handleSubmit} method="post" className="mb-5">
                    <div className="row mb-3">
                        <div className="col-xl-1">
                            <Input label="Numéro" error={error?.data?.errors?.number} />
                        </div>
                        <div className="col-xl-5">
                            <Input label="Nom" name="firstname" error={error?.data?.errors?.firstname} />
                        </div>
                        <div className="col-xl-6">
                            <Input label="Prénoms" name="lastname" error={error?.data?.errors?.lastname} required={false} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-xl-3">
                            <Select
                                label="Sexe"
                                defaultOption="Garçon"
                                name="gender"
                                options={gender}
                                error={error?.data?.errors?.gender}
                            />
                        </div>
                        <div className="col-xl-3">
                            <Input type="date" label="Date de naissance" name="birth_date" error={error?.data?.errors?.birth_date} />
                        </div>
                        <div className="col-xl-6">
                            <Input label="Lieu de naissance" name="birth_place" error={error?.data?.errors?.birth_place} required={false} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-xl-12">
                            <Input required={false} label="Parents" name="parents" error={error?.data?.errors?.parents} />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-xl-6">
                            <Select
                                label="Etablissement"
                                options={ScDatas}
                                config={{ optionKey: 'id', valueKey: 'name' }}
                                name="school"
                                error={error?.data?.errors?.school}
                            />
                        </div>
                        <div className="col-xl-3">
                            <Select
                                label="Classe"
                                options={ClDatas}
                                config={{ optionKey: 'id', valueKey: 'name' }}
                                name="classes"
                                error={error?.data?.errors?.classes}
                            />
                        </div>
                        <div className="col-xl-3">
                            <Select
                                name="scholar_year"
                                options={scholar_years()}
                                label="Année scolaire"
                                error={error?.data?.errors?.scholar_year}
                            />
                        </div>
                    </div>

                    <Button
                        loading={SRequestState.creating}
                        icon="save"
                        type="submit"
                        mode="primary"
                    >
                        Enregistrer
                    </Button>
                </form>
            </Block>
        </>
    )
}
