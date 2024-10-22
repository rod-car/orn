/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { Block, DangerButton, Input, PageTitle, PrimaryButton, Select } from 'ui'
import { PrimaryLink } from '@base/components'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router'

const defaultFood = { label: '', unit: '' }

type Consommation = Record<string, string | number>;

export function AddConso(): ReactNode {
    const [food, setFood] = useState(defaultFood);
    const [defaultConsommation, setDefauultConsommation] = useState<Consommation>({date: "date"})
    const [consommations, setConsommations] = useState<Consommation[]>([defaultConsommation]);

    const {id} = useParams()
    const navigate = useNavigate()

    const { Client, RequestState, error } = useApi<Food>({
        baseUrl: config.baseUrl,
        url: '/foods'
    })

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassClient, datas: classes, RequestState: ClassRequestState } = useApi<Classes>({
        baseUrl: config.baseUrl,
        url: '/classes',
        key: 'data'
    })

    const handleInputChange = useCallback(({ target }: InputChange) => {
        setFood(prevState => ({
            ...prevState,
            [target.name]: target.value
        }))
    }, [])

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault()

        const response = id === undefined
            ? await Client.post(food)
            : await Client.patch(id, food)

        if (response.ok) {
            const message = id === undefined ? "Enregistré" : "Modifé"

            toast(message, {
                type: 'success',
                position: config.toastPosition
            })
            id === undefined && setFood(defaultFood)
        } else {
            const r = response?.response;
            if (r.status === 403) {
                toast('Accès non autorisé', {
                    type: 'error',
                    position: config.toastPosition
                })
            } else {
                toast('Formulaire invalide', {
                    type: 'error',
                    position: config.toastPosition
                })
            }
        }
    }, [Client, food])

    const getClasses = async () => {
        const classes = await ClassClient.get()
        if (classes) {
            classes.forEach(classe => {
                defaultConsommation[" " + classe.id] = "number"
            })

            defaultConsommation["teachers"] = "number"
            defaultConsommation["cookers"] = "number"

            setDefauultConsommation({...defaultConsommation})
            setConsommations([defaultConsommation])
        }
    }

    useEffect(() => {
        const getFood = async () => {
            if (id !== undefined) {
                const food = await Client.find(id)
                if (food !== null) {
                    setFood(food)
                    return
                }
                navigate('not-found', {replace: true})
            }
        }
        getFood()
        SchoolClient.get()
        getClasses()
    }, [])

    return (
        <>
            <PageTitle title={id === undefined ? "Ajouter une consommation" : "Modifier un aliment"}>
                <PrimaryLink icon="list" to="/cantine/consommation/list">
                    Historique des consommations
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form onSubmit={handleSubmit} method="post">
                    <div className="row mb-4">
                        <div className="col-6 mb-3">
                            <Select label="Établissement" options={schools} config={{optionKey: 'id', valueKey: 'name'}} loading={SchoolRequestState.loading} />
                        </div>
                        <div className="col-3 mb-3">
                            <Input
                                onChange={handleInputChange}
                                value={food.label}
                                error={error?.data?.errors?.label}
                                label="Date de prise"
                                name="date"
                                type="date"
                            />
                        </div>
                        <div className="col-3 mb-3">
                            <Select label="Année scolaire" options={["Année 1", "Année 2", "Année 3"]} />
                        </div>

                        <div className="col-6 mb-3">
                            <Input label="Nombre d'enseignant" placeholder="Nombre des enseignants qui ont mangé" type="number" />
                        </div>
                        <div className="col-6 mb-3">
                            <Input label="Nombre de cuisinier" placeholder="Nombre des enseignants qui ont mangé" type="number" />
                        </div>
                    </div>

                    <h6 className="text-primary mt-4">Consommation des étudiants</h6>
                    <hr />

                    <div className="table-responsive mb-3">
                        <table className="table table-bordered table-striped text-sm mb-0">
                            <thead>
                                <tr>
                                    <th>Date de prise</th>
                                    {classes && classes.map(classe => <th className="text-nowrap" key={classe.id}>{classe.notation}</th>)}
                                    <th>Ens</th>
                                    <th>Cui</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consommations.map((consommation, index) => <tr key={index}>
                                    {Object.keys(consommation).map(key => {
                                        const fieldType = consommation[key]
                                        return <td key={key}>
                                            {fieldType === "number" && <Input type="number" value={0} onChange={() => {}} />}
                                            {fieldType === "date" && <Input type="date" value={new Date().toDateString()} onChange={() => {}} />}
                                        </td>})
                                    }
                                    <td className="d-flex align-items-center">
                                        <PrimaryButton icon="plus-lg" onClick={() => alert("Hello world")} />
                                        <DangerButton icon="dash-lg" onClick={() => alert("Minus")} />
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>

                    <PrimaryButton loading={RequestState.creating || RequestState.loading || RequestState.updating} icon="save" type="submit">
                        Enregistrer
                    </PrimaryButton>
                </form>
            </Block>
        </>
    )
}