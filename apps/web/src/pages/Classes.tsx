import { FormEvent, useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { config } from '../config'
import { useApi } from 'hooks'
import { toast } from 'react-toastify'
import { ApiErrorMessage, Block, Button } from 'ui'
import { NavLink } from 'react-router-dom'
import { Link } from '@renderer/components'

export function Classes(): JSX.Element {
    const { Client, datas, RequestState, error, resetError } = useApi<Classes>({
        baseUrl: config.baseUrl,
        url: '/classes',
        key: 'data'
    })

    const getData = async (): Promise<void> => {
        await Client.get()
    }

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const id = data.get('id')?.toString()
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
                                type: 'success',
                                position: config.toastPosition
                            })
                            getData()
                        } else {
                            toast('Impossible de supprimer cette classe', {
                                closeButton: true,
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
                            closeButton: true,
                            type: 'error',
                            position: config.toastPosition
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
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Liste des classes</h2>
                <div className="d-flex justify-content-between align-items-center">
                    <Button
                        onClick={getData}
                        icon="refresh"
                        type="button"
                        mode="secondary"
                        className="me-2"
                        loading={RequestState.loading}
                    >
                        Recharger
                    </Button>
                    <Link to="/anthropo-measure/school/classes/add" className="btn primary-link">
                        <i className="fa fa-plus me-2"></i>Nouvelle classe
                    </Link>
                </div>
            </div>

            <Block>
                {error && (
                    <ApiErrorMessage
                        className="mb-3"
                        message={error.message}
                        onClose={(): void => {
                            resetError()
                        }}
                    />
                )}

                <div className="d-flex justify-content-end mb-3">
                    <h5 className="text-primary">Arrêté au nombre de {datas.length} classe(s)</h5>
                </div>

                <table className="table table-striped mb-5 table-bordered">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Niveau</th>
                            <th>Notation</th>
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
                            datas.map((classes) => (
                                <tr key={classes.id}>
                                    <td>{classes.name}</td>
                                    <td>{classes.level?.label ?? 'N/A'}</td>
                                    <td>{classes.notation}</td>
                                    <td>
                                        <NavLink
                                            className="btn-sm me-2 btn btn-primary"
                                            to={`/anthropo-measure/school/classes/edit/${classes.id}`}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </NavLink>
                                        <form
                                            className="d-inline"
                                            action=""
                                            method="post"
                                            onSubmit={handleSubmit}
                                        >
                                            <input type="hidden" name="id" value={classes.id} />
                                            <Button
                                                type="submit"
                                                mode="danger"
                                                icon="trash"
                                                size="sm"
                                            />
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        {!RequestState.loading && datas.length <= 0 && (
                            <tr>
                                <td colSpan={4} className="text-center">
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
