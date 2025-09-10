import { useApi, useAuthStore } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, PageTitle } from "ui";
import { config } from '@base/config'
import { ActivityLoading, Link, PrimaryLink } from "@base/components";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

export function ActivityTypeList(): ReactNode {
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
                            getActivities()
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

    return <>
        <PageTitle title="Types d'activités">
            <PrimaryLink permission="activity-type.create" to="/activities/types/add" icon="plus-lg">
                Nouveau type
            </PrimaryLink>
        </PageTitle>

        {RequestState.loading ? <ActivityLoading admin={true} /> : <Block>
            <table className="table table-striped table-bordered table-hover text-sm">
                <thead>
                    <tr>
                        <th>Nom de l'activité</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Jardin scolaire</td>
                        <td>Supprimer</td>
                    </tr>
                </tbody>
            </table>
        </Block>}
    </>
}