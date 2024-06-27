import { useApi } from 'hooks'
import { Link } from '@renderer/components'
import { config } from '@renderer/config'
import { Block, Button, Select } from 'ui'
import { useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { format, number_array, range } from 'functions'

import { Pagination } from 'react-laravel-paginex'
import Skeleton from 'react-loading-skeleton'

/**
 * Page d'accueil de gestion des étudiants
 * @returns JSX.Element
 */
export function AccessRequest(): JSX.Element {
    const [perPage, setPerPage] = useState(30)

    const { Client, RequestState, error, datas: users, setDatas: setUsers } = useApi<User>({
        baseUrl: config.baseUrl,
        
        url: '/auth/users',
        key: 'data'
    })

    const requestData = {
        per_page: perPage,
        is_valid: false
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
            message: 'Voulez-vous ne pas approuver cette demande ?',
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

    /**
     * Valider la demande d'accès d'un utilisateur
     * 
     * @param user 
     */
    async function validate(user: User) {
        toast("Validation en cours", {
            position: config.toastPosition,
            type: "info"
        })

        const response = await Client.post(user, "/" + user.id + "/validate")

        if (response.ok) {
            const datas = users.data.filter((u: User) => u.id !== user.id);
            users.data = datas

            setUsers(users)
            toast("Validé", {
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

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="text-muted">Liste des demande d'accès</h2>
                <div className="d-flex align-items-between">
                    <Button
                        icon="refresh"
                        mode="secondary"
                        type="button"
                        className="me-2"
                        onClick={getDatas}
                        loading={RequestState.loading}
                    >
                        Recharger
                    </Button>
                    <Link to="/auth/add-user" className="btn secondary-link me-2">
                        <i className="fa fa-plus me-2"></i>Nouveau utilisateur
                    </Link>
                    <Link to="/auth/users" className="btn primary-link">
                        <i className="fa fa-file me-2"></i>Liste des utilisateurs
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error.message}</div>}

            <Block className="mb-5 mt-3">
                <table className="table table-striped">
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
                    <table className="table table-striped table-bordered mb-5">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th className="text-nowrap">Adresse e-mail</th>
                                <th className="text-nowrap">Nom d'utilisateur</th>
                                <th>Rôle</th>
                                <th className="text-nowrap">Date</th>
                                <th>Status</th>
                                <th className="w-25">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RequestState.loading &&
                                range(10).map((number) => (
                                    <tr key={number}>
                                        {range(8).map((key) => (
                                            <td key={key} className="text-center">
                                                <Skeleton count={1} style={{ height: 30 }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            {users.data?.length > 0 && users.data.map((user: User) => <tr key={user.id}>
                                <td>{user.id}</td>
                                <td className="text-nowrap">{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td><UserRole role={user.role} /></td>
                                <td className="text-nowrap">{format(user.created_at, "dd-MM-y")}</td>
                                <td><UserStatus valid={user.is_valid} /></td>
                                <td className="text-nowrap">
                                    <Button
                                        type="button"
                                        mode="success"
                                        icon="check"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => validate(user)}
                                    />
                                    <Button
                                        type="button"
                                        mode="danger"
                                        icon="close"
                                        size="sm"
                                        onClick={() => invalidate(user)}
                                    />
                                </td>
                            </tr>)}
                            {!RequestState.loading && users.total === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center">
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

const roles = ["Visiteur", "Administrateur", "Super administrateur"]
const classes = ["primary", "danger", "success"]
const userStatus = ["valide", "Non valide"]

function UserRole({ role }: { role: number }) {
    return <span className={`badge rounded-pill p-2 bg-${classes[role]}`}>
        {roles[role]}
    </span>
}

function UserStatus({ valid }: { valid: number }) {
    const key = valid === 1 ? 0 : 1
    return <span className={`badge rounded-pill p-2 bg-${classes[key]}`}>
        {userStatus[key]}
    </span>
}
