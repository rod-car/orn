import { Link } from 'react-router-dom'
import { Block } from 'ui'
import { PriceForm } from './PriceForm'

export function PriceAdd(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un prix d'articles</h2>
                <Link to="/prices/list" className="btn btn-primary">
                    <i className="bi bi-list me-2"></i>Liste des prix d'articles
                </Link>
            </div>

            <Block className="mb-5">
                <PriceForm />
            </Block>
        </>
    )
}
