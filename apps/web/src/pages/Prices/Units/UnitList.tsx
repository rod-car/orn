/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, DangerButton, PageTitle } from "ui";
import { config } from '@base/config'
import { UnitLoading, PrimaryLink, EditLink } from "@base/components";
import { Pagination } from '@base/components'
import { confirmAlert } from "react-confirm-alert";
import { toast } from "@base/ui";

export function UnitList(): ReactNode {
    const {
        Client,
        datas: units,
        RequestState,
        error
    } = useApi<Unit>({
        url: '/prices/units'
    })

    const queryParams = {
        paginate: true,
        perPage: 15
    }

    const getUnits = async () => {
        await Client.get(queryParams)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({
            ...queryParams,
            page: data.page
        })
    }

    useEffect(() => {
        getUnits()
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
                                type: 'success'
                            })
                            getUnits()
                        } else {
                            toast('Erreur de suppression', {
                                closeButton: true,
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error'
                        })
                }
            ]
        })
    }

    return <>
        <PageTitle title="Liste des unités">
            <PrimaryLink permission="unit.create" to="/prices/units/add" icon="plus">
                Ajouter une unité
            </PrimaryLink>
        </PageTitle>

        {error && <div className="alert alert-danger mb-5">{error.message}</div>}

        {RequestState.loading ? <UnitLoading /> : <Block>
            <table className="table table-striped table-bordered table-hover text-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Label</th>
                        <th>Notation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {units && units?.data?.length === 0 && <tr>
                        <td colSpan={4} className="text-center">Aucune données</td>
                    </tr>}
                    {units && units.data?.map((unit: Unit) => <tr key={unit.id}>
                        <td>{unit.id}</td>
                        <td>{unit.name}</td>
                        <td>{unit.notation}</td>
                        <td className="text-nowrap">
                            <EditLink
                                permission="unit.edit"
                                to={`/prices/units/edit/${unit.id}`}
                            />
                            <DangerButton
                                permission="unit.delete"
                                icon="trash"
                                size="sm"
                                onClick={(): void => {
                                    handleDelete(unit.id)
                                }}
                            />
                        </td>
                    </tr>)}
                </tbody>
            </table>

            {units?.meta?.total > units?.meta?.per_page && <Pagination changePage={changePage} data={units} />}
        </Block>}
    </>
}