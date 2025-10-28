/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { Block, Input, PageTitle, PrimaryButton } from 'ui'
import { PrimaryLink } from '@base/components'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from '@base/ui';
import { useNavigate, useParams } from 'react-router'

const defaultFood = { label: '', unit: '', threshold_critical: 0, threshold_warning: 0 }

export function FoodAdd(): ReactNode {
    const [food, setFood] = useState(defaultFood)
    const {id} = useParams()
    const navigate = useNavigate()

    const { Client, RequestState, error } = useApi<Food>({
        url: '/foods'
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
            const message = id === undefined ? "Enregistré" : "Modifié"

            toast(message, {
                type: 'success'
            })
            id === undefined && setFood(defaultFood)
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
    }, [Client, food])

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
    }, [])

    return (
        <>
            <PageTitle title={id === undefined ? "Nouvelle collation" : "Modifier la collation"}>
                <PrimaryLink permission="food.view" icon="list" to="/cantine/foods/list">
                    Liste des collations
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form onSubmit={handleSubmit} method="post">
                    <div className="row mb-4">
                        <div className="col-xl-6 mb-3">
                            <Input
                                onChange={handleInputChange}
                                value={food.label}
                                error={error?.data?.errors?.label}
                                label="Désignation"
                                placeholder="Ex: KOBA"
                                name="label"
                            />
                        </div>
                        <div className="col-xl-6 mb-3">
                            <Input
                                onChange={handleInputChange}
                                value={food.unit}
                                error={error?.data?.errors?.unit}
                                label="Unité"
                                placeholder="Ex: Kg"
                                name="unit"
                            />
                        </div>
                        <div className="col-xl-6">
                            <Input
                                type='number'
                                onChange={handleInputChange}
                                value={food.threshold_warning}
                                error={error?.data?.errors?.label}
                                label="Seuil d'alerte"
                                name="threshold_warning"
                            />
                        </div>
                        <div className="col-xl-6">
                            <Input
                                type='number'
                                onChange={handleInputChange}
                                value={food.threshold_critical}
                                error={error?.data?.errors?.unit}
                                label="Seuil critique"
                                name="threshold_critical"
                            />
                        </div>
                    </div>

                    <PrimaryButton permission="food.create" loading={RequestState.creating || RequestState.updating} icon="save" type="submit">
                        Enregistrer
                    </PrimaryButton>
                </form>
            </Block>
        </>
    )
}