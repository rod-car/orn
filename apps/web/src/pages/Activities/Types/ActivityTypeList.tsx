import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, Button } from "ui";
import { config, getToken } from '@renderer/config'
import { ActivityLoading, Link } from "@renderer/components";
import { Pagination } from 'react-laravel-paginex'
import { wrap } from 'functions'
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

export function ActivityTypeList(): ReactNode {
    const {
        Client,
        datas: activities,
        RequestState
    } = useApi<Activity>({
        baseUrl: config.baseUrl,
        token: getToken(),
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
        <div className="mb-5 d-flex justify-content-between align-items-center">
            <h2>Types d'activités</h2>
            <Link to="/activities/types/add" className="btn secondary-link me-2">
                <i className="fa fa-plus me-2"></i>Nouveau
            </Link>
        </div>

        {RequestState.loading ? <ActivityLoading admin={true} /> : <Block>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom du type</th>
                        <th>Résultats attendu</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activities && activities.data?.map((activity: Activity) => <tr>
                        <td>{activity.id}</td>
                        <td>{activity.title}</td>
                        <td>{activity.date}</td>
                        <td className="text-nowrap">
                            <Link
                                className="btn-sm me-2 btn btn-primary"
                                to={`/activities/types/edit/${1}`}
                            >
                                <i className="fa fa-edit"></i>
                            </Link>
                            <Button
                                type="button"
                                mode="danger"
                                icon="trash"
                                size="sm"
                                onClick={(): void => {
                                    handleDelete(1)
                                }}
                            />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>}
        {activities?.meta?.total > activities?.meta?.per_page && <Pagination changePage={changePage} data={activities} />}
    </>
}