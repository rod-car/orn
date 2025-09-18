/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { PrimaryLink, EditLink } from '@base/components'
import { config } from '@base/config'
import { Block, DangerButton, PageTitle, SecondaryButton } from 'ui'
import { ReactNode, useCallback, useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'

export function FoodList(): ReactNode {
    const { Client, RequestState, error, datas: foods } = useApi<Food>({
        url: '/foods'
    })

    const getDatas = async () => {
        await Client.get()
    }

    useEffect(() => {
        getDatas()
    }, [])

    const handleDelete = useCallback(async (id: number) => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await Client.destroy(id)
                        if (response.ok) {
                            toast('Enregistré', {
                                type: 'success',
                                position: config.toastPosition
                            })
                            getDatas()
                        } else {
                            toast('Erreur de soumission', {
                                type: 'error',
                                position: config.toastPosition
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            type: 'error',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }, [])

    return (
        <>
            <PageTitle title="Liste des collations">
                <div className="d-flex justify-content-between">
                    <SecondaryButton permission="food.view" icon="arrow-clockwise" className="me-2" onClick={getDatas} loading={RequestState.loading}>
                        Recharger
                    </SecondaryButton>
                    <PrimaryLink permission="food.create"  icon="plus-lg" to="/cantine/foods/add">
                        Nouveau
                    </PrimaryLink>
                </div>
            </PageTitle>

            <Block className="mb-5">
                {error && <div className="alert alert-danger">{error.message}</div>}

                <table className="table table-striped table-bordered table-hover text-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Désignation</th>
                            <th>Unité</th>
                            <th>Seuil d'alerte</th>
                            <th>Seuil critique</th>
                            <th className="w-15">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RequestState.loading && (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Chargement...
                                </td>
                            </tr>
                        )}
                        {foods &&
                            foods.map((food, index) => (
                                <tr key={food.id}>
                                    <td className="fw-bold">{index + 1}</td>
                                    <td>{food.label}</td>
                                    <td>{food.unit}</td>
                                    <td>{food.threshold_warning}</td>
                                    <td>{food.threshold_critical}</td>
                                    <td>
                                        <EditLink permission="food.edit" to={`/cantine/foods/edit/${food.id}`} />
                                        <DangerButton permission="food.delete" icon="trash" size="sm" onClick={() => handleDelete(food.id) }/>
                                    </td>
                                </tr>
                            ))
                        }
                        {!RequestState.loading && foods.length <= 0 && (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Aucune données
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Block>
        </>
    )
}
