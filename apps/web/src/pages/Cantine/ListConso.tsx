import { Block } from 'ui'
import { Link } from '@base/components'

export function ListConso(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="m-0">Liste des consommation</h2>
                <Link to="/cantine/add-conso" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Ajouter un consommation
                </Link>
            </div>

            <Block>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas porro explicabo, provident necessitatibus, temporibus voluptatum veniam reiciendis aliquam quam animi iste! Neque temporibus amet possimus reiciendis tempora provident quam veniam.</p>
            </Block>
        </>
    )
}
