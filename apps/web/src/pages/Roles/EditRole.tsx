import { useApi } from 'hooks';
import { Block, PageTitle } from 'ui';
import { RoleForm } from './RoleForm.tsx';
import { PrimaryLink } from '@base/components';
import { useNavigate, useParams } from 'react-router';
import { ReactNode, useCallback, useEffect, useState } from 'react';

type Role = {
    id: number;
    name: string;
    permissions: string[]
}

export function EditRole(): ReactNode {
    const [role, setRole] = useState<Role>()
    const { Client, RequestState } = useApi<Role>({
        url: '/roles',
        key: 'items'
    })

    const { id } = useParams()
    const navigate = useNavigate()

    const getRole = useCallback(async (): Promise<void> => {
        const data = await Client.find(id as string)

        if (data) setRole(data.items)
        else navigate("not-found")
    }, [])

    useEffect(() => {
        getRole()
    }, [])

    return (
        <>
            <PageTitle title="Modifier un role">
                <PrimaryLink permission="role.view" to="/user/role" icon='list'>
                    Liste des roles
                </PrimaryLink>
            </PageTitle>

            <Block>
                {RequestState.loading ? <span className='text-center w-100 d-block'>Chargement...</span> : <RoleForm editRole={role} />}
            </Block>
        </>
    )
}