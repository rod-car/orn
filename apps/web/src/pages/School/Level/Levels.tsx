/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from 'react'
import { config } from '@base/config'
import { useApi, useAuthStore } from 'hooks'
import { ApiErrorMessage, Block, Button, PageTitle, SecondaryButton } from 'ui'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { EditLink, PrimaryLink } from '@base/components'

export function Levels(): ReactNode {
    const { Client, datas, RequestState, error, resetError, success } = useApi<Niveau>({
        url: '/levels',
        key: 'data'
    })

    const getData = async (): Promise<void> => {
        await Client.get()
    }

    useEffect(() => {
        getData()
    }, [])

    const handleDelete = (id: number): void => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        await Client.destroy(id ?? 0)
                        if (success)
                            toast('Supprimé', {
                                closeButton: true,
                                type: 'success',
                                position: config.toastPosition
                            })
                        getData()
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }

    const { isAdmin } = useAuthStore()

    return (
        <>
            <PageTitle title="Liste des niveaux">
                <div className="d-flex justify-content-between align-items-center">
                    <SecondaryButton
                        onClick={getData}
                        icon="arrow-clockwise"
                        className="me-2"
                        loading={RequestState.loading}
                    >Recharger</SecondaryButton>
                    <PrimaryLink can={isAdmin} icon="plus-lg" to="/anthropo-measure/school/levels/add">
                        Ajouter un niveau
                    </PrimaryLink>
                </div>
            </PageTitle>

            <Block>
                {error && (
                    <ApiErrorMessage
                        className="mb-3"
                        message={error.message}
                        onClose={() => resetError()}
                    />
                )}

                <table className="table table-striped text-sm table-bordered m-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Label</th>
                            <th>Description</th>
                            <th style={{ width: '15%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RequestState.loading && (
                            <tr>
                                <td colSpan={4} className="text-center">
                                    Chargement...
                                </td>
                            </tr>
                        )}
                        {datas.length > 0 &&
                            datas.map((level, index) => (
                                <tr key={level.id}>
                                    <td className="fw-bold">{index + 1}</td>
                                    <td>{level.label}</td>
                                    <td>{level.description ?? 'N/A'}</td>
                                    <td>
                                        <EditLink can={isAdmin} to={`/anthropo-measure/school/levels/edit/${level.id}`} />
                                        <Button can={isAdmin}
                                            mode="danger"
                                            icon="trash"
                                            size="sm"
                                            onClick={() => handleDelete(level.id as number)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        {!RequestState.loading && datas.length <= 0 && (
                            <tr>
                                <td colSpan={5} className="text-center">
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