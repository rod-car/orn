/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { wrap } from 'functions'
import { Block, Button, DangerButton, PageTitle } from "ui";
import { config } from '@base/config'
import { toast } from "react-toastify";
import { DetailLink, EditLink, Pagination, PrimaryLink } from '@base/components'
import { ReactNode, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { ActivityLoading, Link } from "@base/components";

export function AdminActivityList(): ReactNode {
    const { Client, datas: activities, RequestState } = useApi<Activity>({
        
        url: '/activities'
    })

    const queryParams = {
        paginate: true,
        perPage: 15,
        imagesCount: 4
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

    return <>
        <PageTitle title="Liste des activités">
            <PrimaryLink to="/activities/admin/add" icon="plus-lg">
                Nouveau
            </PrimaryLink>
        </PageTitle>

        {RequestState.loading ? <ActivityLoading admin={true} /> : <Block>
            <table className="table table-striped table-bordered text-sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Titre</th>
                        <th>Date</th>
                        <th>Lieu</th>
                        <th className="w-15">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activities && activities.data?.map((activity: Activity, index) => <tr key={activity.id}>
                        <td>{index + 1}</td>
                        <td>{activity.title}</td>
                        <td>{activity.date}</td>
                        <td>{activity.place}</td>
                        <td className="text-nowrap">
                            <DetailLink className="me-2" to={`/activities/show/${activity.id}`} />
                            <EditLink className="me-2" to={`/activities/admin/edit/${activity.id}`} />
                            <DangerButton icon="trash" size="sm" onClick={() => handleDelete(activity.id) }/>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>}
        {activities?.meta?.total > activities?.meta?.per_page && <Pagination changePage={changePage} data={activities} />}
    </>
}