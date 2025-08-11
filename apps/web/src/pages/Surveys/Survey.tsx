/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { PrimaryLink, InfoLink, DetailLink, EditLink } from '@base/components'
import { config } from '@base/config'
import { Block, DangerButton, PageTitle, SecondaryButton } from 'ui'
import { ReactNode, useCallback, useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { format } from 'functions'

export function Survey(): ReactNode {
    const { Client, RequestState, error, datas: surveys } = useApi<Survey>({
        url: '/surveys',
        key: 'data'
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
    }, [])

    return (
        <>
            <PageTitle title="Liste des mesures">
                <div className="d-flex align-items-between">
                    <SecondaryButton
                        icon="arrow-clockwise"
                        className="me-2"
                        onClick={getDatas}
                        loading={RequestState.loading}
                        permission="anthropometry.view"
                    >Recharger</SecondaryButton>
                    <PrimaryLink permission="anthropometry.create" icon="plus-lg" to="/anthropo-measure/survey/add" className="me-2">
                        Nouvelle mesure
                    </PrimaryLink>
                    <InfoLink permission="anthropometry.form" icon="plus-lg" to="/anthropo-measure/survey/add-student">
                        Formulaire de mesure
                    </InfoLink>
                </div>
            </PageTitle>

            <Block className="mb-5">
                {error && <div className="alert alert-danger">{error.message}</div>}

                <table className="table table-striped table-bordered table-hover text-sm">
                    <thead>
                        <tr>
                            <th>Mesure</th>
                            <th>Date de début</th>
                            <th>Année scolaire</th>
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
                                    <td className="fw-bold">{survey.phase}</td>
                                    <td>{format(survey.date, 'dd MMMM y')}</td>
                                    <td>{survey.scholar_year}</td>
                                    <td>
                                        <DetailLink permission="anthropometry.show" to={`/anthropo-measure/survey/details/${survey.id}`} />
                                        <EditLink permission="anthropometry.edit" to={`/anthropo-measure/survey/edit/${survey.id}`} />
                                        <DangerButton permission="anthropometry.delete" icon="trash" size="sm" onClick={() => handleDelete(survey.id) }/>
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
