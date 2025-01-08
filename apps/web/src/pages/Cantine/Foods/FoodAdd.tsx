/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { Block, Input, PageTitle, PrimaryButton } from 'ui'
import { PrimaryLink } from '@base/components'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router'

const defaultFood = { label: '', unit: '' }

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
            <PageTitle title={id === undefined ? "Nouveau aliment" : "Modifier un aliment"}>
                <PrimaryLink icon="list" to="/cantine/foods/list">
                    Liste des aliments
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form onSubmit={handleSubmit} method="post">
                    <div className="row mb-4">
                        <div className="col-xl-6">
                            <Input
                                onChange={handleInputChange}
                                value={food.label}
                                error={error?.data?.errors?.label}
                                label="Désignation"
                                placeholder="Ex: KOBA"
                                name="label"
                            />
                        </div>
                        <div className="col-xl-6">
                            <Input
                                onChange={handleInputChange}
                                value={food.unit}
                                error={error?.data?.errors?.unit}
                                label="Unité"
                                placeholder="Ex: Kg"
                                name="unit"
                            />
                        </div>
                    </div>

                    <PrimaryButton loading={RequestState.creating || RequestState.loading || RequestState.updating} icon="save" type="submit">
                        Enregistrer
                    </PrimaryButton>
                </form>
            </Block>
        </>
    )
}