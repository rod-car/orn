/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { Block, Input, PageTitle, PrimaryButton, Select } from 'ui'
import { PrimaryLink } from '@base/components'
import { useApi, useAuthStore } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { Col, Row } from '@base/components/Bootstrap'

export function StockIn(): ReactNode {
    const [school, setSchool] = useState<number | undefined>();
    const [collation, setCollation] = useState<number | undefined>();
    const [unit, setUnit] = useState<string>()
    const [label, setLabel] = useState<string>('')
    const [quantity, setQuantity] = useState<number | undefined>(0);
    const [date, setDate] = useState<string>('');

    const { Client, RequestState } = useApi<Stock>({ url: '/stocks' })
    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
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
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const data = {
            date: date,
            school_id: school,
            food_id: collation,
            quantity: quantity,
            label: label,
            type: "e"
        }

        const response = await Client.post(data)

        if (response.ok) {
            const message = "Enregistré"

            setDate('')
            setLabel('')
            setQuantity(0)

            toast(message, {
                type: 'success',
                position: config.toastPosition
            })
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
    }

    const changeCollation = useCallback(({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(target.value, 10)
        const selectedCollaction = foods.filter(food => food.id === value).at(0)
        if (selectedCollaction) setUnit(selectedCollaction.unit)

        setCollation(value)
    }, [foods])

    const changeSchool = useCallback(({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(target.value, 10)
        setSchool(value)
    }, [schools])

    useEffect(() => {
        getDatas()
    }, [])

    return (
        <>
            <PageTitle title="Entree en stock">
                <PrimaryLink icon="list" to="/cantine/stock/list">
                    Fiche de stock
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

                        <Col n={6} className="mb-3">
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

                        <Col n={6} className="mb-3">
                            <Input
                                label="Libelle"
                                value={label}
                                onChange={({ target }) => setLabel(target.value, 10)}
                                controlled
                            />
                        </Col>

                        <Col n={6} className="mb-3">
                            <Input
                                label="Date"
                                type="date"
                                value={date}
                                onChange={({ target }) => setDate(target.value)}
                                required
                            />
                        </Col>

                        <Col n={6} className="mb-3">
                            <Input
                                label={`Quantite recu ${unit ? '(' + unit + ')' : ''}`}
                                value={quantity}
                                onChange={({ target }) => setQuantity(parseInt(target.value, 10))}
                                controlled
                            />
                        </Col>
                    </Row>

                    <div className="d-flex">
                        <PrimaryButton className='me-3' loading={RequestState.creating || RequestState.loading || RequestState.updating || FoodRequestState.loading || SchoolRequestState.loading} icon="save" type="submit">
                            Enregistrer
                        </PrimaryButton>
                    </div>
                </form>
            </Block>
        </>
    )
}