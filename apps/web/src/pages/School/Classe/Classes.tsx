/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { config } from '@base/config'
import { useApi } from 'hooks'
import { toast } from '@base/ui';
import { ApiErrorMessage, Block, DangerButton, PageTitle, SecondaryButton } from 'ui'
import { EditLink, PrimaryLink } from '@base/components'

export function Classes(): ReactNode {
    const { Client, datas, RequestState, error, resetError } = useApi<Classes>({
        url: '/classes',
        key: 'data'
    })

    const getData = async (): Promise<void> => {
        await Client.get()
    }

    const handleDelete = (id: number): void => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await Client.destroy(id ?? 0)
                        if (response.ok) {
                            toast('Supprimé', {
                                closeButton: true,
                                type: 'success'
                            })
                            getData()
                        } else {
                            toast('Impossible de supprimer cette classe', {
                                closeButton: true,
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error'
                        })
                }
            ]
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <PageTitle title={`Liste des classes ${datas.length > 0 ? '(' + datas.length + ')' : ''}`}>
                <div className="d-flex justify-content-between align-items-center">
                    <SecondaryButton
                        permission="class.view"
                        onClick={getData}
                        icon="arrow-clockwise"
                        className="me-2"
                        loading={RequestState.loading}
                    >Recharger</SecondaryButton>
                    <PrimaryLink permission="class.create" to="/anthropo-measure/school/classes/add" icon="plus-lg">Nouvelle classe</PrimaryLink>
                </div>
            </PageTitle>

            <Block>
                {error && <ApiErrorMessage className="mb-3" message={error.message} onClose={() => resetError()} />}

                <table className="table table-striped table-bordered table-hover text-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom</th>
                            <th>Niveau</th>
                            <th>Notation</th>
                            <th style={{ width: '15%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RequestState.loading && (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Chargement...
                                </td>
                            </tr>
                        )}
                        {datas.length > 0 &&
                            datas.map((classes, index) => (
                                <tr key={classes.id}>
                                    <th className="fw-bold">{index + 1}</th>
                                    <td>{classes.name}</td>
                                    <td>{classes.level?.label ?? 'N/A'}</td>
                                    <td>{classes.notation}</td>
                                    <td>
                                        <EditLink permission="class.edit" to={`/anthropo-measure/school/classes/edit/${classes.id}`} />
                                        <DangerButton
                                            permission="class.delete"
                                            icon="trash"
                                            size="sm"
                                            onClick={() => handleDelete(classes.id as number)}
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
