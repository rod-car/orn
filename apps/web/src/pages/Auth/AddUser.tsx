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
                <PrimaryLink to="/auth/users">
                    <i className="bi bi-list me-2"></i>Liste des utilisateurs
                </PrimaryLink>
            </PageTitle>

            <Block>
                <RegisterForm external={false} />
            </Block>
        </>
    )
}