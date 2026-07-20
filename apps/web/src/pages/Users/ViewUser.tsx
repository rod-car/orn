import { useApi } from 'hooks'
import { Block, PageTitle } from 'ui'
import { ReactNode, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PrimaryLink } from '@base/components'
import Skeleton from 'react-loading-skeleton'

export function ViewUser(): ReactNode {
    const { id } = useParams<{ id: string }>()

    const { Client, data: user } = useApi<User>({
        url: '/users'
    })

    const getUserData = async () => {
        if (id) {
            await Client.find(id)
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    return <>
        <PageTitle title={`Profil de ${user?.items?.name ?? ''}`}>
            <PrimaryLink permission="user.view" to="/user/list" icon='list'>
                Liste des utilisateurs
            </PrimaryLink>
        </PageTitle>

        <Block>
            {user && user.items ? (
                <div className="row gy-4">
                    <div className="col-12 col-lg-6">
                        <h5 className="mb-3">Informations générales</h5>
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <th style={{ width: 180 }}>Nom</th>
                                    <td>{user.items.name || '—'}</td>
                                </tr>
                                <tr>
                                    <th>Occupation</th>
                                    <td>{user.items.occupation || '—'}</td>
                                </tr>
                                <tr>
                                    <th>Adresse e-mail</th>
                                    <td>{user.items.email || '—'}</td>
                                </tr>
                                <tr>
                                    <th>Nom d'utilisateur</th>
                                    <td>{user.items.username || '—'}</td>
                                </tr>
                                <tr>
                                    <th>Établissement</th>
                                    <td>{user.items.school?.name ?? 'Aucun'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-12 col-lg-6">
                        <h5 className="mb-3">Rôles</h5>
                        {user.items.roles && user.items.roles.length > 0 ? (
                            <div className="mb-4">
                                {user.items.roles.map((role: { id: number; name: string }) => (
                                    <span key={role.id} className="badge bg-primary me-2 mb-2 p-2">
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted mb-4">Aucun rôle attribué</p>
                        )}

                        <h5 className="mb-3">Permissions</h5>
                        {user.items.permissions && user.items.permissions.length > 0 ? (
                            <div>
                                {user.items.permissions.map((permission: { id: number; name: string }) => (
                                    <span key={permission.id} className="badge bg-secondary me-2 mb-2 p-2">
                                        {permission.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">Aucune permission spécifique</p>
                        )}
                    </div>
                </div>
            ) : (
                <ViewUserLoading />
            )}
        </Block>
    </>
}

function ViewUserLoading(): ReactNode {
    return <div className="row gy-4">
        <div className="col-12 col-lg-6">
            <Skeleton height={25} count={5} className="mb-2" />
        </div>
        <div className="col-12 col-lg-6">
            <Skeleton height={25} count={5} className="mb-2" />
        </div>
    </div>
}