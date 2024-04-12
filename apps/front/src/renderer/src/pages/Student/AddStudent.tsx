import { FormEvent, useEffect } from 'react'
import { Button, Input, Select } from 'ui'
import { Link } from 'react-router-dom'
import { useApi } from 'hooks'
import { config } from '../../../config'
import { toast } from 'react-toastify'
import { gender, scholar_years } from 'functions'

export function AddStudent(): JSX.Element {
    const {
        Client: SClient,
        RequestState: SRequestState,
    } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students'
    })

    const {
        Client: ScClient,
        datas: ScDatas,
    } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const {
        Client: ClClient,
        datas: ClDatas,
    } = useApi<Classes>({
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
                <h1>Ajouter un étudiant</h1>
                <Link to="/student/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </div>

            <form action="" onSubmit={handleSubmit} method="post" className="mb-5">
                <div className="row mb-3">
                    <div className="col-xl-1">
                        <Input label="Numéro" />
                    </div>
                    <div className="col-xl-5">
                        <Input label="Nom" name="firstname" />
                    </div>
                    <div className="col-xl-6">
                        <Input label="Prénoms" name="lastname" required={false} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-xl-3">
                        <Select
                            label="Sexe"
                            defaultOption="Garçon"
                            name="gender"
                            options={gender}
                        />
                    </div>
                    <div className="col-xl-3">
                        <Input type="date" label="Date de naissance" name="birth_date" />
                    </div>
                    <div className="col-xl-6">
                        <Input label="Lieu de naissance" name="birth_place" />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-xl-6">
                        <Input required={false} label="Père" name="father" />
                    </div>
                    <div className="col-xl-6">
                        <Input required={false} label="Mère" name="mother" />
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-xl-6">
                        <Select
                            label="Etablissement"
                            options={ScDatas}
                            config={{ optionKey: 'id', valueKey: 'name' }}
                            name="school"
                        />
                    </div>
                    <div className="col-xl-3">
                        <Select
                            label="Classe"
                            options={ClDatas}
                            config={{ optionKey: 'id', valueKey: 'name' }}
                            name="classes"
                        />
                    </div>
                    <div className="col-xl-3">
                        <Select
                            name="scholar_year"
                            options={scholar_years()}
                            label="Année scolaire"
                        />
                    </div>
                </div>

                <Button loading={SRequestState.creating} icon="save" type="submit" mode="primary">
                    Enregistrer
                </Button>
            </form>
        </>
    )
}
