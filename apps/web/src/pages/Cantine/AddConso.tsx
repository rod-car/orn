/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { Block, DangerButton, Input, PageTitle, PrimaryButton, SecondaryButton, Select, Spinner } from 'ui'
import { PrimaryLink, ScholarYearSelectorServer } from '@base/components'
import { useApi, useAuthStore } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { Col, Row } from '@base/components/Bootstrap'

let defaultConsommation: Consommation = {}

export function AddConso({editedConso = undefined}: {editedConso?: ConsommationModel}): ReactNode {
    const [consommations, setConsommations] = useState<Consommation[]>([]);
    const [scholarYear, setScholarYear] = useState<string|number>(editedConso ? editedConso.scholar_year_id : 0)
    const [schoolId, setSchoolId] = useState<number>(editedConso ? editedConso.school_id : 0)
    const [foodId, setFoodId] = useState<number>(editedConso ? editedConso.food_id : 0)

    const { Client, RequestState } = useApi<ConsommationModel>({ url: '/consommations' })
    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassClient, datas: classes } = useApi<Classes>({
        url: '/classes',
        key: 'data'
    })

    const { Client: FoodClient, datas: foods, RequestState: FoodRequestState } = useApi<Food>({
        url: '/foods'
    })

    const { user } = useAuthStore()

    const getConsommations = async () => {
        const classes = await ClassClient.get()
        if (classes)
        {
            const updatedConsommation = { ...defaultConsommation };

            updatedConsommation['_date'] = { type: 'date', value: "2024-01-01" };

            classes.forEach(classe => {
                updatedConsommation["_" + classe.id] = { type: 'number', value: 0 };
            });

            updatedConsommation['_others'] = { type: 'number', value: 0 };
            updatedConsommation['_teachers'] = { type: 'number', value: 0 };
            updatedConsommation['_cookers'] = { type: 'number', value: 0 };

            defaultConsommation = { ...updatedConsommation }

            if (editedConso) generateConsommations(editedConso.id)
            else setConsommations([updatedConsommation]);
        }
    }

    const handleInputChange = useCallback(({ target }: InputChange) => {
        const { name, value } = target;
        const [index, key] = name.split("_");

        setConsommations(prevConsommations => {
            const updatedConsommations = [...prevConsommations];
            const consommationToUpdate = { ...updatedConsommations[index] };

            consommationToUpdate[`_${key}`] = {
                ...consommationToUpdate[`_${key}`],
                value: value,
            };

            updatedConsommations[index] = consommationToUpdate;
            return updatedConsommations;
        });
    }, [])

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        const data = {
            scholar_year_id: scholarYear,
            school_id: schoolId,
            food_id: foodId,
            consommations: consommations
        }

        const response = editedConso === undefined
            ? await Client.post(data)
            : await Client.patch(editedConso.id, data)

        if (response.ok) {
            const message = editedConso === undefined ? "Enregistré" : "Modifié"

            toast(message, {
                type: 'success',
                position: config.toastPosition
            })
            editedConso === undefined && setConsommations([defaultConsommation])
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
    }, [Client])

    const add = () => {
        setConsommations([...consommations, {...defaultConsommation}])
    }

    const remove = (mainKey: number) => {
        const fields = consommations.filter((_value, key) => {
            return key !== mainKey
        })
        setConsommations([...fields])
    }

    useEffect(() => {
        if (user?.school) setSchoolId(user.school.id)
        SchoolClient.get()
        FoodClient.get()
        getConsommations()
    }, [])

    async function generateConsommations(consoId: number) {
        const response = await Client.get({
            school_id: schoolId,
            scholar_year_id: scholarYear,
            food_id: foodId
        }, '/generate/' + consoId)

        setConsommations(Object.values(response) as unknown as Consommation[])
    }

    return (
        <>
            <PageTitle title={editedConso === undefined ? "Ajouter une consommation" : "Mise a jour des consommations"}>
                <PrimaryLink permission="consommation.view" icon="list" to="/cantine/consommation/list">
                    Historique des consommations
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form onSubmit={handleSubmit} method="post">
                    <Row className="mb-6">
                        <Col n={4} className="mb-3">
                        {user?.school ? <Input label='Établissement' auto disabled defaultValue={user.school.name} /> : <Select
                                label="Établissement"
                                options={schools}
                                config={{optionKey: 'id', valueKey: 'name'}}
                                loading={SchoolRequestState.loading}
                                value={schoolId}
                                onChange={({target}) => setSchoolId(parseInt(target.value, 10))}
                                disabled={editedConso !== undefined}
                                controlled
                            />}
                        </Col>
                        <Col n={4} className="mb-3">
                            <ScholarYearSelectorServer
                                label="Année scolaire"
                                scholarYear={scholarYear}
                                setScholarYear={setScholarYear}
                                disabled={editedConso !== undefined}
                            />
                        </Col>
                        <Col n={4} className="mb-3">
                            <Select
                                label="Collation"
                                options={foods}
                                config={{optionKey: 'id', valueKey: 'label'}}
                                loading={FoodRequestState.loading}
                                value={foodId}
                                onChange={({target}) => setFoodId(parseInt(target.value, 10))}
                                disabled={editedConso !== undefined}
                                controlled
                            />
                        </Col>
                    </Row>

                    <h6 className="text-primary mt-4">Consommation des étudiants</h6>
                    <hr />

                    {consommations.length > 0 ? <div className="table-responsive mb-3">
                        <div className="sticky-table">
                            <table className="table table-bordered table-striped text-sm mb-0">
                                <thead>
                                    <tr>
                                        <th className='bg-info text-white'>Date de prise</th>
                                        {classes && classes.map(classe => <th className="text-nowrap text-white bg-info" key={classe.id}>{classe.notation}</th>)}
                                        <th className='bg-info text-white'>Autres</th>
                                        <th className='bg-info text-white'>Ens</th>
                                        <th className='bg-info text-white'>Cui/Dist</th>
                                        <th className='bg-info text-white'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consommations.map((consommation, index) => <tr key={index}>
                                        {Object.keys(consommation).map(key => {
                                            if (typeof consommation[key] === 'object') {
                                                const fieldType = consommation[key].type
                                                const fieldValue = consommation[key].value
                                                return <td style={{minWidth: 90}} key={key}>
                                                    {fieldType === "number" && <Input name={index + key} type="number" value={fieldValue} onChange={handleInputChange} />}
                                                    {fieldType === "date" && <Input name={index + key} type="date" value={fieldValue} onChange={handleInputChange} />}
                                                </td>
                                            }
                                        })}
                                        <td className="d-flex align-items-center">
                                            {index === 0 && <PrimaryButton icon="plus-lg" className='me-2 p-2' onClick={add} />}
                                            {index > 0 && <DangerButton icon="dash-lg" className='p-2' onClick={() => remove(index)} />}
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div> : <Spinner isBorder size='sm' className='text-center' />}

                    <div className="d-flex">
                        <PrimaryButton permission="consommation.create" className='me-3' loading={RequestState.creating || RequestState.loading || RequestState.updating || FoodRequestState.loading || SchoolRequestState.loading } icon="save" type="submit">
                            Enregistrer
                        </PrimaryButton>
                        <SecondaryButton permission="consommation.create" onClick={add} icon="plus" type="button">
                            Ajouter une ligne
                        </SecondaryButton>
                    </div>
                </form>
            </Block>
        </>
    )
}