import { Link } from '@base/components'
import { Block } from 'ui'
import { RegisterForm } from '@base/pages/Auth'

/**
 * Page d'accueil de gestion des étudiants
 * @returns JSX.Element
 */
export function AddUser(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="text-muted">Ajout un nouveau utilisateur</h2>
                <div className="d-flex align-items-between">
                    <Link to="/auth/users" className="btn primary-link">
                        <i className="bi bi-list me-2"></i>Liste des utilisateurs
                    </Link>
                </div>
            </div>

            <Block>
                <RegisterForm external={false} />
            </Block>
        </>
    )
}