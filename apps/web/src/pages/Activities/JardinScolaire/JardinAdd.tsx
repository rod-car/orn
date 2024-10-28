import { Link } from 'react-router-dom'
import { Block } from 'ui'
import { JardinForm } from './JardinForm'

export function JardinAdd(): ReactNode {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3>Nouveau jardin (Distribution)</h3>
                <Link to="/scholar-garden/list" className="btn btn-primary">
                    <i className="bi bi-list me-2"></i>Liste des jardins
                </Link>
            </div>

            <Block className="mb-5">
                <JardinForm />
            </Block>
        </>
    )
}
