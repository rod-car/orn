import { useApi } from 'hooks'
import { Link } from '@renderer/components'
import { config, getToken } from '../../config'
import { ApiErrorMessage, Block, Button } from 'ui'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert'

/**
 * Page d'accueil de gestion des étudiants
 * @returns JSX.Element
 */
export function School(): JSX.Element {
    const {
        Client,
        datas: schools,
        RequestState,
        error,
        resetError
    } = useApi<School>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/schools',
        key: 'data'
    })

    const getSchools = async (): Promise<void> => {
        await Client.get()
    }

    const handleDelete = async (id: number): Promise<void> => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await Client.destroy(id)
                        if (response.ok) {
                            toast('Enregistré', {
                                closeButton: true,
                                type: 'success',
                                position: config.toastPosition
                            })
                            getSchools()
                        } else {
                            toast('Erreur de soumission', {
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
        getSchools()
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Liste des établissement</h2>
                <div className="d-flex align-items-between">
                    <Button
                        onClick={getSchools}
                        className="me-2"
                        type="button"
                        mode="secondary"
                        icon="refresh"
                        loading={RequestState.loading}
                    >
                        Rechargher
                    </Button>
                    <Link to="/school/add" className="btn primary-link">
                        <i className="fa fa-plus me-2"></i>Nouveau
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
                    <h4>Arrêté au nombre de {schools.length} école(s)</h4>
                </div>

                <table className="table table-striped table-bordered mb-5">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Commune</th>
                            <th>District</th>
                            <th>Adresse</th>
                            <th>Responsable</th>
                            <th style={{ width: '15%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RequestState.loading && (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Chargement...
                                </td>
                            </tr>
                        )}
                        {schools.length > 0 &&
                            schools.map((school) => (
                                <tr key={school.id}>
                                    <td>{school.name}</td>
                                    <td>{school?.commune?.name}</td>
                                    <td>{school?.commune?.district.name}</td>
                                    <td>{school.localisation}</td>
                                    <td>{school.responsable}</td>
                                    <td>
                                        <Link
                                            className="btn-sm me-2 btn btn-info text-white"
                                            to={`/school/details/${school.id}`}
                                        >
                                            <i className="fa fa-folder"></i>
                                        </Link>
                                        <Link
                                            className="btn-sm me-2 btn btn-primary"
                                            to={`/school/edit/${school.id}`}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Link>
                                        <Button
                                            type="button"
                                            mode="danger"
                                            icon="trash"
                                            size="sm"
                                            onClick={(): void => {
                                                handleDelete(school.id)
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        {!RequestState.loading && schools.length <= 0 && (
                            <tr>
                                <td colSpan={7} className="text-center">
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
