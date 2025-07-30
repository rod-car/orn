/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApi } from 'hooks';
import { config } from '@base/config';
import { toast } from 'react-toastify';
import { EditLink, PrimaryLink } from '@base/components';
import { confirmAlert } from 'react-confirm-alert';
import { Block, DangerButton, PageTitle } from 'ui';
import { useEffect } from 'react';

type Role = {
    id: number;
    name: string;
};

export function ListRole() {
    const { Client, RequestState, datas: roles } = useApi<Role>({
        url: '/roles',
        key: 'items'
    })

    const getDatas = async () => {
        await Client.get()
    }

    useEffect(() => {
        getDatas()
    }, [])

    const confirmDelete = async (user: Role): Promise<void> => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ce role ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await Client.destroy(user.id)

                        if (response.ok) {
                            await getDatas()
                            toast("Role supprime", {
                                position: config.toastPosition,
                                type: "success"
                            })
                        } else {
                            toast("Erreur de suppression", {
                                position: config.toastPosition,
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
                            type: 'error',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }

    const columns = [
        { label: '#', key: 'id', align: 'center', width: '2rem' },
        { label: 'Nom', key: 'name' },
        { label: 'Actions', key: 'actions', align: 'center' },
    ];

    return <>
        <PageTitle title="Liste des roles">
            <PrimaryLink permission="role.create" icon="plus-lg" to="/user/role/create">
                Nouveau role
            </PrimaryLink>
        </PageTitle>

        <Block>
            <table className="table table-striped table-bordered table-hover text-sm">
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
                    ) : roles.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-4">
                                <p className={`text-info my-3`}>
                                    Aucune autorisation n'est actuellement disponible.
                                </p>
                            </td>
                        </tr>
                    ) : (
                        roles.map((role: Role) => <tr key={role.id}>
                            <td className="text-center">{role.id}</td>
                            <td>{role.name}</td>
                            <td>
                                <div className="d-flex justify-content-center">
                                    <EditLink permission="role.edit" to={`/user/role/edit/${role.id}`} />
                                    <DangerButton
                                        permission="role.delete"
                                        icon="trash"
                                        size="sm"
                                        onClick={() => confirmDelete(role)}
                                    />
                                </div>
                            </td>
                        </tr>)
                    )}
                </tbody>
            </table>
        </Block>
    </>
}