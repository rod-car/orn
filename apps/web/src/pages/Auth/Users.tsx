import { useApi, useAuthStore } from 'hooks'
import { EditLink, InfoLink, Link, PrimaryLink } from '@base/components'
import { config } from '@base/config'
import { Block, Button, DangerButton, PageTitle, SecondaryButton, Select } from 'ui'
import { ReactNode, useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { format, number_array, range } from 'functions'

import { Pagination } from '@base/components'
import Skeleton from 'react-loading-skeleton'

/**
 * Page d'accueil de gestion des étudiants
 * @returns ReactNode
 */
export function Users(): ReactNode {
    const [perPage, setPerPage] = useState(30)

    const { Client, RequestState, error, datas: users, setDatas: setUsers } = useApi<User>({
        url: '/auth/users',
        key: 'data'
    })

    const requestData = {
        per_page: perPage,
        is_valid: true
    }

    const getDatas = (): void => {
        Client.get(requestData)
    }

    useEffect(() => {
        getDatas()
    }, [])

    const invalidate = async (user: User): Promise<void> => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous retirer cet utuilisateur ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await Client.post(user, "/" + user.id + "/invalidate")
                        if (response.ok) {
                            const datas = users.data.filter((u: User) => u.id !== user.id);
                            users.data = datas

                            setUsers(users)
                            toast("Demande non approuvé", {
                                position: config.toastPosition,
                                type: "success"
                            })
                        } else {
                            toast("Erreur de validation", {
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

    const filter = async (target: EventTarget & (HTMLSelectElement | HTMLInputElement)): Promise<void> => {
        const { value, name } = target

        if (name === 'per-page') {
            setPerPage(parseInt(value))
            requestData['per_page'] = parseInt(value)
        }

        await Client.get(requestData)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({ ...requestData, page: data.page })
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
                    <InfoLink permission="user.create" to="/user/add" icon="plus-lg" className="me-2">
                        Nouveau utilisateur
                    </InfoLink>
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
                                    placeholder="Tous"
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
                                <th className="text-nowrap">Etablissement</th>
                                <th>Status</th>
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
                            {users.data?.length > 0 && users.data.map((user: User, index: number) => <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td className="text-nowrap">{user.name}</td>
                                <td>{user.occupation}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td><UserRole role={user.role} /></td>
                                <td className="text-nowrap">{user.school ? user.school.name : '---'}</td>
                                <td><UserStatus valid={user.is_valid} /></td>
                                <td className="text-nowrap">
                                    <EditLink permission="user.edit" to={`/user/edit/${user.id}`} />
                                    <DangerButton
                                        permission="user.delete"
                                        icon="trash"
                                        size="sm"
                                        onClick={() => invalidate(user)}
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
                {users.total > 0 && users.last_page > 1 && (
                    <Pagination changePage={changePage} data={users} />
                )}
            </Block>
        </>
    )
}

const roles = ["Invite", "Administrateur", "Super administrateur"]
const classes = ["primary", "danger", "success"]
const userStatus = ["valide", "Non valide"]

function UserRole({ role }: { role: number }) {
    return <span className={`badge rounded-pill p-2 bg-${classes[role]}`}>
        {roles[role]}
    </span>
}

function UserStatus({ valid }: { valid: number }) {
    const key = valid === 1 ? 0 : 1

    return <span className={`badge rounded-pill p-2 bg-${classes[valid === 1 ? 2 : key]}`}>
        {userStatus[key]}
    </span>
}
