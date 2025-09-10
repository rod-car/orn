import { ReactNode } from 'react';
import { UserForm } from './UserForm';
import { Block, PageTitle } from 'ui';
import { PrimaryLink } from '@base/components';

/**
 * Page d'accueil de gestion des étudiants
 * @returns ReactNode
 */
export function CreateUser(): ReactNode {
    return (
        <>
            <PageTitle title="Ajout un nouveau utilisateur">
                <PrimaryLink permission="user.view" to="/user/list" icon='list'>
                    Liste des utilisateurs
                </PrimaryLink>
            </PageTitle>

            <Block>
                <UserForm />
            </Block>
        </>
    )
}