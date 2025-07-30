import { ReactNode } from 'react';
import { Block, PageTitle } from 'ui';
import { PrimaryLink } from '@base/components';
import { PermissionForm } from './PermissionForm';

/**
 * Page d'accueil de gestion des étudiants
 * @returns ReactNode
 */
export function CreatePermission(): ReactNode {
    return (
        <>
            <PageTitle title="Ajout un nouveau permission">
                <PrimaryLink permission="permission.view" to="/user/permission" icon='list'>
                    Liste des permissions
                </PrimaryLink>
            </PageTitle>

            <Block>
                <PermissionForm />
            </Block>
        </>
    )
}