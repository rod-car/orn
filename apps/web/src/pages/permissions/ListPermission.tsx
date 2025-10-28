/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApi } from 'hooks';
import { useEffect } from 'react';
import { config } from '@base/config';
import { toast } from '@base/ui';
import { confirmAlert } from 'react-confirm-alert';
import { Block, DangerButton, PageTitle } from 'ui';
import { EditLink, Pagination, PrimaryLink } from '@base/components';

type Permission = {
    id: number;
    name: string;
    description: string;
};

export function ListPermission() {
    const { Client, RequestState, datas: permissions } = useApi<Permission>({
        url: '/permissions',
    })

    const requestData = {
        page: 1,
        per_page: 30
    }

    const getDatas = async () => {
        await Client.get(requestData)
    }

    useEffect(() => {
        getDatas()
    }, [])

    const confirmDelete = async (permission: Permission): Promise<void> => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer cette permission ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await Client.destroy(permission.id)

                        if (response.ok) {
                            await getDatas()
                            toast("Permission supprime", {
                                
                                type: "success"
                            })
                        } else {
                            toast("Erreur de suppression", {
                                
                                type: "error"
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

    const changePage = async (data: { page: number }) => {
        await Client.get({ ...requestData, page: data.page })
    }

    const columns = [
        { label: '#', key: 'id', align: 'center', width: '2rem' },
        { label: 'Nom', key: 'name' },
        { label: 'Description', key: 'description' },
        { label: 'Actions', key: 'actions', align: 'center' },
    ];

    return <>
        <PageTitle title="Liste des permissions">
            <PrimaryLink permission="permission.create" to="/user/permission/create">
                Nouvelle permission
            </PrimaryLink>
        </PageTitle>

        <Block>
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover table-hover text-sm">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th 
                                    key={index}
                                    className={`text-${column.align || 'start'}`}
                                    style={column.width ? { width: column.width } : {}}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {RequestState.loading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    <p className="text-info my-3">
                                        Chargement des données...
                                    </p>
                                </td>
                            </tr>
                        ) : permissions?.data?.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    <p className={`text-info my-3`}>
                                        Aucune autorisation n'est actuellement disponible.
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            permissions?.data?.map((permission: Permission) => <tr key={permission.id}>
                                <td className="text-center">{permission.id}</td>
                                <td><span className='badge bg-success'>{permission.name}</span></td>
                                <td><span className='badge bg-primary'>{permission.description}</span></td>
                                <td>
                                    <div className="d-flex justify-content-center">
                                        <EditLink permission="permission.edit" to={`/user/permission/edit/${permission.id}`} />
                                        <DangerButton
                                            permission="permission.delete"
                                            icon="trash"
                                            size="sm"
                                            onClick={() => confirmDelete(permission)}
                                        />
                                    </div>
                                </td>
                            </tr>)
                        )}
                    </tbody>
                </table>
            </div>

            {permissions?.meta?.total > 0 && permissions?.meta?.last_page > 1 && (
                <Pagination changePage={changePage} data={permissions} />
            )}
        </Block>
    </>
}