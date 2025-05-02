import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, Button } from "ui";
import { config } from '@base/config'
import { UnitLoading, Link } from "@base/components";
import { Pagination } from '@base/components'
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

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
                                type: 'success',
                                position: config.toastPosition
                            })
                            getUnits()
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
            <h2>Liste des unités</h2>
            <Link to="/prices/units/add" className="btn secondary-link me-2">
                <i className="bi bi-plus-lg me-2"></i>Ajouter une unité
            </Link>
        </div>

        {error && <div className="alert alert-danger mb-5">{error.message}</div>}

        {RequestState.loading ? <UnitLoading /> : <Block>
            <table className="table table-striped table-bordered">
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
                            <Link
                                className="btn-sm me-2 btn btn-primary"
                                to={`/prices/units/edit/${unit.id}`}
                            >
                                <i className="bi bi-pencil-square"></i>
                            </Link>
                            <Button
                                type="button"
                                mode="danger"
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
        </Block>}
        {units?.meta?.total > units?.meta?.per_page && <Pagination changePage={changePage} data={units} />}
    </>
}