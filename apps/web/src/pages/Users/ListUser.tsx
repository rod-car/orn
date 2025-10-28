/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks';
import { config } from '@base/config';
import { toast } from '@base/ui';
import Skeleton from 'react-loading-skeleton';
import { Pagination } from '@base/components';
import { number_array, range } from 'functions';
import { confirmAlert } from 'react-confirm-alert';
import { ReactNode, useEffect, useState } from 'react';
import { EditLink, InfoLink, PrimaryLink } from '@base/components';
import { Block, DangerButton, PageTitle, SecondaryButton, Select } from 'ui';

export function ListUser(): ReactNode {
    const [perPage, setPerPage] = useState(10)

    const { Client, RequestState, error, datas: users } = useApi<User>({
        url: '/users'
    })

    const requestData = {
        page: 1,
        per_page: perPage,
        is_valid: true
    }

    const getDatas = async () => {
        await Client.get(requestData)
    }

    useEffect(() => {
        getDatas()
    }, [])

    const confirmDelete = async (user: User): Promise<void> => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer cet utilisateur ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await Client.destroy(user.id)
                        console.log(response);

                        if (response.ok) {
                            await getDatas()
                            toast("Compte utilisateur supprime", {
                                type: "success"
                            })
                        } else {
                            toast("Erreur de validation", {
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

    const filter = async (target: EventTarget & (HTMLSelectElement | HTMLInputElement)): Promise<void> => {
        const { value, name } = target

        if (name === 'per-page') {
            setPerPage(parseInt(value))
            requestData['per_page'] = parseInt(value)
        }

        await Client.get(requestData)
    }

    const changePage = async (data: { page: number }) => {
        await Client.get({ ...requestData, page: data.page })
    }

    return (
        <>
            <PageTitle title="Liste des utilisateurs">
                <div className="d-flex align-items-between">
                    <SecondaryButton
                        permission="user.view"
                        icon="arrow-clockwise"
                        className="me-2"
                        onClick={getDatas}
                        loading={RequestState.loading}
                    >
                        Recharger
                    </SecondaryButton>
                    <PrimaryLink permission="user.create" to="/user/create" icon='plus-lg' className="me-2">
                        Nouveau utilisateur
                    </PrimaryLink>
                    <PrimaryLink permission="access-request.view" icon='file-earmark-text' to="/auth/access-request">
                        Liste des demande d'accès
                    </PrimaryLink>
                </div>
            </PageTitle>

            {error && <div className="alert alert-danger">{error.message}</div>}

            <Block className="mb-5 mt-3">
                <table className="table table-striped table-hover text-sm">
                    <thead>
                        <tr>
                            <th>Elements</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Select
                                    placeholder={null}
                                    value={perPage}
                                    options={number_array(100, 10)}
                                    name="per-page"
                                    onChange={({ target }): Promise<void> => filter(target)}
                                    controlled
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Block>

            <Block>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover text-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Fonction</th>
                                <th className="text-nowrap">Adresse e-mail</th>
                                <th className="text-nowrap">Nom d'utilisateur</th>
                                <th>Rôle</th>
                                <th className="text-nowrap">Établissement</th>
                                <th style={{ width: "10%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RequestState.loading &&
                                range(10).map((number) => (
                                    <tr key={number}>
                                        {range(9).map((key) => (
                                            <td key={key} className="text-center">
                                                <Skeleton count={1} style={{ height: 30 }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            {users?.data && users.data.length > 0 && users.data.map((user: User, index: number) => <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td className="text-nowrap">{user.name}</td>
                                <td>{user.occupation}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td><UserRole roles={user.roles} /></td>
                                <td className="text-nowrap">{user.school ? user.school.name : '---'}</td>
                                <td className="text-nowrap">
                                    <InfoLink icon='eye' permission="user.show" to={`/user/show/${user.id}`} className='me-2 btn-sm' />
                                    <EditLink permission="user.edit" to={`/user/edit/${user.id}`} />
                                    <DangerButton
                                        permission="user.delete"
                                        icon="trash"
                                        size="sm"
                                        onClick={() => confirmDelete(user)}
                                    />
                                </td>
                            </tr>)}
                            {!RequestState.loading && users.total === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center">
                                        Aucune données
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {users?.meta?.total > 0 && users?.meta?.last_page > 1 && (
                    <Pagination changePage={changePage} data={users} />
                )}
            </Block>
        </>
    )
}

function UserRole({ roles }: { roles: {id: number, name: string}[] }) {
    return roles.map(role => <span key={role.id} className={`badge rounded-pill p-2 bg-primary`}>
        {role.name}
    </span>)
}
