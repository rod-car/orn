import { useApi } from 'hooks'
import { Link } from '@renderer/components'
import { config, getToken } from '../../../config'
import { Block, Button } from 'ui'
import { useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { format } from 'functions'

/**
 * Page d'accueil de gestion des étudiants
 * @returns JSX.Element
 */
export function Survey(): JSX.Element {
    const {
        Client,
        RequestState,
        error,
        datas: surveys
    } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/surveys',
        key: 'data'
    })

    const getDatas = async (): Promise<void> => {
        await Client.get()
    }

    useEffect(() => {
        getDatas()
    }, [])

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
                                position: 'bottom-right'
                            })
                            getDatas()
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error',
                                position: 'bottom-right'
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
                            position: 'bottom-right'
                        })
                }
            ]
        })
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Liste des mésures</h2>
                <div className="d-flex align-items-between">
                    <Button
                        icon="refresh"
                        mode="secondary"
                        type="button"
                        className="me-2"
                        onClick={getDatas}
                        loading={RequestState.loading}
                    >
                        Recharger
                    </Button>
                    <Link to="/survey/add" className="btn secondary-link me-2">
                        <i className="fa fa-plus me-2"></i>Nouvelle mésure
                    </Link>
                    <Link to="/survey/add-student" className="btn primary-link">
                        <i className="fa fa-plus me-2"></i>Formulaire de mesure
                    </Link>
                </div>
            </div>

            <Block className="mb-5">
                {error && <div className="alert alert-danger">{error.message}</div>}

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Phase d'enquête</th>
                            <th>Date</th>
                            <th className="w-15">Actions</th>
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
                        {surveys &&
                            surveys.map((survey) => (
                                <tr key={survey.id}>
                                    <td>{survey.id}</td>
                                    <td>{survey.phase}</td>
                                    <td>{format(survey.date, 'dd MMMM y')}</td>
                                    <td>
                                        <Link
                                            className="btn-sm me-2 btn btn-info text-white"
                                            to={`/survey/details/${survey.id}`}
                                        >
                                            <i className="fa fa-folder"></i>
                                        </Link>
                                        <Link
                                            className="btn-sm me-2 btn btn-primary"
                                            to={`/survey/edit/${survey.id}`}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Link>
                                        <Button
                                            type="button"
                                            mode="danger"
                                            icon="trash"
                                            size="sm"
                                            onClick={(): void => {
                                                handleDelete(survey.id)
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        {!RequestState.loading && surveys.length <= 0 && (
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
