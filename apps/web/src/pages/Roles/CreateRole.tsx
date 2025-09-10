import { ReactNode } from 'react';
import { Block, PageTitle } from 'ui';
import { PrimaryLink } from '@base/components';
import { RoleForm } from './RoleForm';

/**
 * Page d'accueil de gestion des étudiants
 * @returns ReactNode
 */
export function CreateRole(): ReactNode {
    return (
        <>
            <PageTitle title="Ajout un nouveau role">
                <PrimaryLink permission="role.view" to="/user/role" icon='list'>
                    Liste des roles
                </PrimaryLink>
            </PageTitle>

            <Block>
                <RoleForm />
            </Block>
        </>
    )
}