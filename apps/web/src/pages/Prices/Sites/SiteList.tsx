/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, DangerButton, PageTitle } from "ui";
import { config } from '@base/config'
import { SiteLoading, PrimaryLink, EditLink } from "@base/components";
import { Pagination } from '@base/components'
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

export function SiteList(): ReactNode {
    const {
        Client,
        datas: sites,
        RequestState,
        error
    } = useApi<Site>({
        
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
                            toast('Erreur de suppression', {
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
        <PageTitle title="Liste des sites">
            <PrimaryLink permission="site.create" to="/prices/sites/add" icon="plus-lg">
                Ajouter un site
            </PrimaryLink>
        </PageTitle>

        {error && <div className="alert alert-danger mb-5">{error.message}</div>}

        {RequestState.loading ? <SiteLoading /> : <Block>
            <table className="table table-striped table-bordered table-hover text-sm">
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
                            <EditLink
                                permission="site.edit"
                                to={`/prices/sites/edit/${site.id}`}
                            />
                            <DangerButton
                                permission="site.delete"
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