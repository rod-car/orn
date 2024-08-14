/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { Link, PrimaryLink, InfoLink, DetailLink, EditLink } from '@base/components'
import { config } from '@base/config'
import { Block, Button, DangerButton, PageTitle, SecondaryButton } from 'ui'
import { ReactNode, useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { format } from 'functions'

export function Survey(): ReactNode {
    const { Client, RequestState, error, datas: surveys } = useApi<Survey>({
        baseUrl: config.baseUrl,
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
                                position: config.toastPosition
                            })
                            getDatas()
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

    return (
        <>
            <PageTitle title="Liste des mésures">
                <div className="d-flex align-items-between">
                    <SecondaryButton
                        icon="arrow-clockwise"
                        className="me-2"
                        onClick={getDatas}
                        loading={RequestState.loading}
                    >Recharger</SecondaryButton>
                    <PrimaryLink icon="plus-lg" to="/anthropo-measure/survey/add" className="me-2">
                        Nouvelle mésure
                    </PrimaryLink>
                    <InfoLink icon="plus-lg" to="/anthropo-measure/survey/add-student">
                        Formulaire de mesure
                    </InfoLink>
                </div>
            </PageTitle>

            <Block className="mb-5">
                {error && <div className="alert alert-danger">{error.message}</div>}

                <table className="table table-striped table-bordered text-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Phase d'enquête</th>
                            <th>Date de début</th>
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
                                    <td className="fw-bold">{survey.id}</td>
                                    <td>{survey.phase}</td>
                                    <td>{format(survey.date, 'dd MMMM y')}</td>
                                    <td>
                                        <DetailLink to={`/anthropo-measure/survey/details/${survey.id}`} />
                                        <EditLink to={`/anthropo-measure/survey/edit/${survey.id}`} />
                                        <DangerButton icon="trash" size="sm" onClick={() => handleDelete(survey.id) }/>
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
