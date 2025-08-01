import { PrimaryLink } from '@base/components'
import { Block, PageTitle } from 'ui'
import { RegisterForm } from '@base/pages/Auth'
import { ReactNode } from 'react'

/**
 * Page d'accueil de gestion des étudiants
 * @returns ReactNode
 */
export function AddUser(): ReactNode {
    return (
        <>
            <PageTitle title="Ajout un nouveau utilisateur">
                <PrimaryLink permission="user.view" to="/auth/users" icon="list">
                    Liste des utilisateurs
                </PrimaryLink>
            </PageTitle>

            <Block>
                <RegisterForm external={false} />
            </Block>
        </>
    )
}