/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks';
import { Block, PageTitle } from 'ui';
import { PermissionForm } from './PermissionForm';
import { PrimaryLink } from '@base/components';
import { useNavigate, useParams } from 'react-router';
import { ReactNode, useCallback, useEffect, useState } from 'react';

type Permission = {
    id: number;
    name: string;
    description: string;
}

export function EditPermission(): ReactNode {
    const [permission, setPermission] = useState<Permission>()
    const { Client, RequestState } = useApi<Permission>({
        url: '/permissions',
        key: 'items'
    })

    const { id } = useParams()
    const navigate = useNavigate()

    const getPermission = useCallback(async (): Promise<void> => {
        const data = await Client.find(id as string)

        if (data) setPermission(data.items)
        else navigate("not-found")
    }, [])

    useEffect(() => {
        getPermission()
    }, [])

    return (
        <>
            <PageTitle title="Modifier un permission">
                <PrimaryLink permission="permission.view" to="/user/permission" icon='list'>
                    Liste des permissions
                </PrimaryLink>
            </PageTitle>

            <Block>
                {RequestState.loading ? <span className='text-center w-100 d-block'>Chargement...</span> : <PermissionForm editPermission={permission} />}
            </Block>
        </>
    )
}