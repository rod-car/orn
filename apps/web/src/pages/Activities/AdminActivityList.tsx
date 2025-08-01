/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from "hooks";
import { Block, DangerButton, PageTitle, PrimaryButton } from "ui";
import { config } from '@base/config'
import { toast } from "react-toastify";
import { DetailLink, EditLink, Pagination, PrimaryLink } from '@base/components'
import { ReactNode, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { ActivityLoading } from "@base/components";

export function AdminActivityList(): ReactNode {
    const { Client, datas: activities, RequestState } = useApi<Activity>({
        url: '/activities'
    })

    const queryParams = {
        paginate: true,
        perPage: 15,
        imagesCount: 4,
        validated_only: false
    }

    const getActivities = async () => {
        await Client.get(queryParams)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({
            ...queryParams,
            page: data.page
        })
    }

    useEffect(() => {
        getActivities()
    }, [])

    const handleDelete = async (id: number) => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await Client.destroy(id)
                        if (response.ok) {
                            toast('Supprimé', {
                                type: 'success',
                                position: config.toastPosition
                            })
                            getActivities()
                        } else {
                            toast('Erreur de soumission', {
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
                            type: 'error',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }

    const validateActivity = async (id: number) => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous valider cet activité ? Cet activité sera visible publiquement.',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await Client.patch(id, {is_valid: true})
                        if (response.ok) {
                            toast('Validé', {
                                type: 'success',
                                position: config.toastPosition
                            })
                            getActivities()
                        } else {
                            toast('Erreur de soumission', {
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
                            type: 'error',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }

    return <>
        <PageTitle title="Liste des activités">
            <PrimaryLink permission="acrivity.view" to="/activities/admin/add" icon="plus-lg">
                Nouveau
            </PrimaryLink>
        </PageTitle>

        {RequestState.loading ? <ActivityLoading admin={true} /> : <Block>
            <table className="table table-striped table-bordered text-sm table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Titre</th>
                        <th>Catégorie</th>
                        <th>Date</th>
                        <th>Lieu</th>
                        <th>Status</th>
                        <th className="w-15">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activities && activities.data?.map((activity: Activity, index) => <tr key={activity.id}>
                        <td>{index + 1}</td>
                        <td>{activity.title}</td>
                        <td>{activity?.service?.title}</td>
                        <td>{activity.date}</td>
                        <td>{activity.place}</td>
                        <td>{activity.is_valid ? <span className="badge bg-success">Valide par {activity.validator?.name}</span> : <span className="badge bg-warning">Non valide</span>}</td>
                        <td className="text-nowrap">
                            {!activity.is_valid && <PrimaryButton className="me-2" permission="activity.edit" icon="check" size="sm" onClick={() => validateActivity(activity.id) }/>}
                            <DetailLink permission="activity.show" className="me-2" to={`/activities/show/${activity.id}`} />
                            {activity.editable && <EditLink permission="activity.edit" className="me-2" to={`/activities/admin/edit/${activity.id}`} />}
                            {activity.deletable && <DangerButton permission="activity.delete" icon="trash" size="sm" onClick={() => handleDelete(activity.id) }/>}
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>}
        {activities?.total > activities?.per_page && <Pagination changePage={changePage} data={activities} />}
    </>
}