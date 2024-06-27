import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, Button } from "ui";
import { config } from '@renderer/config'
import { SiteLoading, Link } from "@renderer/components";
import { Pagination } from 'react-laravel-paginex'
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

export function SiteList(): ReactNode {
    const {
        Client,
        datas: sites,
        RequestState,
        error
    } = useApi<Site>({
        baseUrl: config.baseUrl,
        
        url: '/prices/sites'
    })

    const queryParams = {
        paginate: true,
        perPage: 15
    }

    const getSites = async () => {
        await Client.get(queryParams)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({
            ...queryParams,
            page: data.page
        })
    }

    useEffect(() => {
        getSites()
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
                            toast('Supprimé', {
                                closeButton: true,
                                type: 'success',
                                position: config.toastPosition
                            })
                            getSites()
                        } else {
                            toast('Erreur de suppréssion', {
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
            <h2>Liste des sites</h2>
            <Link to="/prices/sites/add" className="btn secondary-link me-2">
                <i className="fa fa-plus me-2"></i>Ajouter un site
            </Link>
        </div>

        {error && <div className="alert alert-danger mb-5">{error.message}</div>}

        {RequestState.loading ? <SiteLoading /> : <Block>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Commune</th>
                        <th>District</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sites && sites?.data?.length === 0 && <tr>
                        <td colSpan={4} className="text-center">Aucune données</td>
                    </tr>}
                    {sites && sites.data?.map((site: Site) => <tr key={site.id}>
                        <td>{site.name}</td>
                        <td>{site.commune?.name}</td>
                        <td>{site.district?.name}</td>
                        <td className="text-nowrap">
                            <Link
                                className="btn-sm me-2 btn btn-primary"
                                to={`/prices/sites/edit/${site.id}`}
                            >
                                <i className="fa fa-edit"></i>
                            </Link>
                            <Button
                                type="button"
                                mode="danger"
                                icon="trash"
                                size="sm"
                                onClick={(): void => {
                                    handleDelete(site.id)
                                }}
                            />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>}
        {sites?.meta?.total > sites?.meta?.per_page && <Pagination changePage={changePage} data={sites} />}
    </>
}