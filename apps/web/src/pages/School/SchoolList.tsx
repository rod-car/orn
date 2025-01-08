/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks'
import { DetailLink, EditLink, Link } from '@base/components'
import { config } from '@base/config'
import { ApiErrorMessage, Block, Button, PageTitle, SecondaryButton } from 'ui'
import { ReactNode, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert'

export function SchoolList(): ReactNode {
    const { Client, datas: schools, RequestState, error, resetError } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { isAdmin } = useAuthStore()

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

    useEffect(() => {
        getSchools()
    }, [])

    return (
        <>
            <PageTitle title={`Liste des établissement ${schools.length > 0 ? '('+ schools.length +' école(s))' : ''}`}>
                <div className="d-flex">
                    <SecondaryButton onClick={getSchools} className="me-2" icon="arrow-clockwise" loading={RequestState.loading}>Rechargher</SecondaryButton>
                    <Link can={isAdmin} to="/anthropo-measure/school/add" className="btn primary-link">
                        <i className="bi bi-plus-lg me-2"></i>Nouveau
                    </Link>
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

                <table className="table table-striped table-bordered text-sm">
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
                                        <DetailLink to={`/anthropo-measure/school/details/${school.id}`} />
                                        <EditLink can={isAdmin} to={`/anthropo-measure/school/edit/${school.id}`} />
                                        <Button can={isAdmin}
                                            mode="danger"
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
