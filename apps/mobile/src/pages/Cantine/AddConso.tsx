/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { Block, Input, PageTitle, PrimaryButton, Select } from 'ui'
import { PrimaryLink } from '@base/components'
import { useApi, useAuthStore } from 'hooks'
import { config } from '@base/config'
import { toast } from '@base/ui';
import { Col, Row } from '@base/components/Bootstrap'

export function AddConso(): ReactNode {
    const [school, setSchool] = useState<number | undefined>();
    const [collation, setCollation] = useState<number | undefined>();
    const [unit, setUnit] = useState<string>()
    const [quantity, setQuantity] = useState<number | undefined>(0);
    const [date, setDate] = useState<string>('');
    const [consommation, setConsommation] = useState<Record<string, number>>()
    const [defaultConso, setDefaultConso] = useState<Record<string, number>>({})

    const { Client, RequestState } = useApi<ConsommationModel>({ url: '/consommations/insert' })
    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassClient } = useApi<Classes>({
        url: '/classes',
        key: 'data'
    })

    const { Client: FoodClient, datas: foods, RequestState: FoodRequestState } = useApi<Food>({
        url: '/foods'
    })

    const { user } = useAuthStore()

    const getDatas = async () => {
        if (user?.school) setSchool(user.school.id)
        else {
            const schools = await SchoolClient.get()
            setSchool(schools.at(0)?.id)
        }

        const foods = await FoodClient.get()
        setCollation(foods.at(0)?.id)
        setUnit(foods.at(0)?.unit)

        const datas = await ClassClient.get()
        datas && datas.map(data => {
            defaultConso[data.notation as string] = 0
        })

        defaultConso["Cuis"] = 0;
        defaultConso["Ens"] = 0;
        defaultConso["Autres"] = 0;

        setDefaultConso({ ...defaultConso })
        setConsommation(defaultConso)
    }

    const handleChange = (name: string, value: number) => {
        if (isNaN(value)) value = 0;
        setConsommation({ ...consommation, [name]: value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const data = {
            date: date,
            school_id: school,
            food_id: collation,
            quantity: quantity,
            lines: consommation
        }

        const response = await Client.post(data)

        if (response.ok) {
            const message = "Enregistré"

            setConsommation(defaultConso)
            setDate('')

            toast(message, {
                type: 'success'
            })
        } else {
            const r = response?.response;
            if (r.status === 403) {
                toast('Accès non autorisé', {
                    type: 'error'
                })
            } else {
                toast('Formulaire invalide', {
                    type: 'error'
                })
            }
        }
    }

    const changeCollation = useCallback(({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(target.value, 10)
        const selectedCollation = foods.filter(food => food.id === value).at(0)
        if (selectedCollation) setUnit(selectedCollation.unit)

        setCollation(value)
    }, [foods])

    const changeQuantity = useCallback(({target}: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(target.value)
        if (isNaN(value)) setQuantity(0)
        else setQuantity(value)
    }, [])

    const changeSchool = useCallback(({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(target.value, 10)
        setSchool(value)
    }, [schools])

    useEffect(() => {
        getDatas()
    }, [])

    return (
        <>
            <PageTitle title="Ajouter une consommation">
                <PrimaryLink permission="consommation.view" icon="list" to="/cantine/consommation/list">
                    Historique des consommations
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form onSubmit={handleSubmit} method="post">
                    <Row className="mb-6">
                        <Col n={12} className="mb-3">
                            {user?.school ? <Input label='Établissement' auto disabled defaultValue={user.school.name} /> : <Select
                                label="Établissement"
                                options={schools}
                                config={{ optionKey: 'id', valueKey: 'name' }}
                                loading={SchoolRequestState.loading}
                                value={school}
                                onChange={changeSchool}
                                controlled
                            />}
                        </Col>

                        <Col n={4} className="mb-3">
                            <Input
                                label="Date"
                                type="date"
                                value={date}
                                onChange={({ target }) => setDate(target.value)}
                                required
                            />
                        </Col>

                        <Col n={4} className="mb-3">
                            <Select
                                label="Collation"
                                options={foods}
                                config={{ optionKey: 'id', valueKey: 'label' }}
                                loading={FoodRequestState.loading}
                                value={collation}
                                onChange={changeCollation}
                                controlled
                            />
                        </Col>

                        <Col n={4} className="mb-3">
                            <Input
                                label={`Quantité Consomme ${unit ? '(' + unit + ')' : ''}`}
                                value={quantity}
                                type="number"
                                onChange={changeQuantity}
                                controlled
                            />
                        </Col>
                    </Row>

                    <h6 className="text-primary mt-4">Details des consommations</h6>
                    <hr />

                    {consommation && Object.keys(consommation).map(name => <div key={name} className="col-12">
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text text-primary fw-bold w-20">
                                {name}
                            </span>
                            <div className="w-80">
                                <Input
                                    style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                                    maxLength={9}
                                    value={consommation[name].toString()}
                                    onChange={({ target }) => handleChange(name, parseFloat(target.value))}
                                    inputMode='numeric'
                                    type='number'
                                />
                            </div>

                            {/*<div className='col-4 d-flex align-items-center justify-content-start'>
                                <span>{name}</span>
                            </div>
                            <div className='col-8'>
                                <Input
                                    maxLength={9}
                                    value={consommation[name].toString()}
                                    onChange={({ target }) => handleChange(name, parseFloat(target.value))}
                                    inputMode='numeric'
                                    type='number'
                                />
                            </div>*/}
                        </div>
                    </div>)}

                    <hr />

                    <div className="d-flex">
                        <PrimaryButton permission="consommation.create" className='me-3' loading={RequestState.creating || RequestState.updating || FoodRequestState.loading} icon="save" type="submit">
                            Enregistrer
                        </PrimaryButton>
                    </div>
                </form>
            </Block>
        </>
    )
}