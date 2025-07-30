import { useApi } from 'hooks';
import { Block, PageTitle } from 'ui';
import { UserForm } from './UserForm.tsx';
import { PrimaryLink } from '@base/components';
import { useNavigate, useParams } from 'react-router';
import { ReactNode, useCallback, useEffect, useState } from 'react';

export function EditUser(): ReactNode {
    const [user, setUser] = useState<User>()
    const { Client, RequestState } = useApi<User>({
        url: '/users',
        key: 'items'
    })

    const { id } = useParams()
    const navigate = useNavigate()

    const getUser = useCallback(async (): Promise<void> => {
        const data = await Client.find(id as string)

        if (data) setUser(data.items)
        else navigate("not-found")
    }, [])

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            <PageTitle title="Modifier un utilisateur">
                <PrimaryLink permission="user.view" to="/user/list" icon='list'>
                    Liste des utilisateurs
                </PrimaryLink>
            </PageTitle>

            <Block>
                {RequestState.loading ? <span className='text-center w-100 d-block'>Chargement...</span> : <UserForm editUser={user} />}
            </Block>
        </>
    )
}