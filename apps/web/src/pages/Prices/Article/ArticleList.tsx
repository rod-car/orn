import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, Button } from "ui";
import { config, getToken } from '@renderer/config'
import { ArticleLoading, Link } from "@renderer/components";
import { Pagination } from 'react-laravel-paginex'
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

export function ArticleList(): ReactNode {
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
            <h2>Liste des articles</h2>
            <Link to="/prices/articles/add" className="btn secondary-link me-2">
                <i className="fa fa-plus me-2"></i>Nouveau article
            </Link>
        </div>

        {RequestState.loading ? <ArticleLoading /> : <Block>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Désignation</th>
                        <th>Prix</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activities && activities.data?.map((activity: Activity) => <tr>
                        <td>{activity.id}</td>
                        <td>{activity.title}</td>
                        <td>{activity.date}</td>
                        <td>{activity.place}</td>
                        <td className="text-nowrap">
                            <Link
                                className="btn-sm me-2 btn btn-primary"
                                to={`/prices/articles/edit/${activity.id}`}
                            >
                                <i className="fa fa-edit"></i>
                            </Link>
                            <Button
                                type="button"
                                mode="danger"
                                icon="trash"
                                size="sm"
                                onClick={(): void => {
                                    handleDelete(activity.id)
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