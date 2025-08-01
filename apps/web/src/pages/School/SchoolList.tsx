/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { DetailLink, EditLink, PrimaryLink } from '@base/components'
import { config } from '@base/config'
import { ApiErrorMessage, Block, DangerButton, PageTitle, SecondaryButton } from 'ui'
import { ReactNode, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert'

export function SchoolList(): ReactNode {
    const { Client, datas: schools, RequestState, error, resetError } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const getSchools = async () => {
        await Client.get()
    }

    const handleDelete = useCallback(async (id: number) => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    className: 'btn btn-danger',
                    onClick: async () => {
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
                    className: 'btn btn-primary',
                    onClick: () => {
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error',
                            position: config.toastPosition
                        })
                    }
                }
            ]
        })
    }, [])

    const { isAllowed } = useAuthStore();

    useEffect(() => {
        getSchools()
    }, [])

    return (
        <>
            <PageTitle title={`Liste des établissement ${schools.length > 0 ? '('+ schools.length +' école(s))' : ''}`}>
                <div className="d-flex">
                    <SecondaryButton permission="school.view" onClick={getSchools} className="me-2" icon="arrow-clockwise" loading={RequestState.loading}>
                        Rechargher
                    </SecondaryButton>
                    <PrimaryLink permission="school.create" to="/anthropo-measure/school/add" icon='plus-lg'>
                        Nouveau etablissement
                    </PrimaryLink>
                </div>
            </PageTitle>

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

                <table className="table table-striped table-bordered table-hover text-sm">
                    <thead>
                        <tr>
                            <th>#</th>
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
                                <td colSpan={8} className="text-center">
                                    Chargement...
                                </td>
                            </tr>
                        )}
                        {schools.length > 0 &&
                            schools.map((school, index) => (
                                <tr key={school.id}>
                                    <td className="fw-bold">{index + 1}</td>
                                    <td>{school.name}</td>
                                    <td>{school?.commune?.name}</td>
                                    <td>{school?.commune?.district.name}</td>
                                    <td>{school.localisation}</td>
                                    <td>{school.responsable}</td>
                                    <td>
                                        <DetailLink permission="school.show" to={`/anthropo-measure/school/details/${school.id}`} />
                                        {isAllowed("school.edit", school.id) && <EditLink permission="school.edit" to={`/anthropo-measure/school/edit/${school.id}`} />}
                                        <DangerButton
                                            permission="school.delete"
                                            icon="trash"
                                            size="sm"
                                            onClick={() => handleDelete(school.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        {!RequestState.loading && schools.length <= 0 && (
                            <tr>
                                <td colSpan={8} className="text-center">
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
