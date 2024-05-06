import { FormEvent, useEffect } from 'react'
import { config, getToken } from '../../config'
import { useApi } from 'hooks'
import { ApiErrorMessage, Block, Button } from 'ui'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { Link } from '@renderer/components'

export function Levels(): JSX.Element {
    const { Client, datas, RequestState, error, resetError, success } = useApi<Niveau>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/levels',
        key: 'data'
    })

    const getData = async (): Promise<void> => {
        await Client.get()
    }

    useEffect(() => {
        getData()
    }, [])

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

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Liste des niveaux</h2>
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
                    <Link to="/school/levels/add" className="btn primary-link">
                        <i className="fa fa-plus me-2"></i>Nouveau niveau
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

                <table className="table table-striped mb-5">
                    <thead>
                        <tr>
                            <th>ID</th>
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
                            datas.map((level) => (
                                <tr key={level.id}>
                                    <td>{level.id}</td>
                                    <td>{level.label}</td>
                                    <td>{level.description ?? 'N/A'}</td>
                                    <td>
                                        <Link
                                            className="btn-sm me-2 btn btn-primary"
                                            to={`/school/levels/edit/${level.id}`}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Link>
                                        <form
                                            className="d-inline"
                                            action=""
                                            method="post"
                                            onSubmit={handleSubmit}
                                        >
                                            <input type="hidden" name="id" value={level.id} />
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
