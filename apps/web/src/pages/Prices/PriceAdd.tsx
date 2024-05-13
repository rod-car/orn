import { NavLink } from 'react-router-dom'
import { Block } from 'ui'
import { PriceForm } from './PriceForm'

export function PriceAdd(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un activité</h2>
                <NavLink to="/activities/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des activités
                </NavLink>
            </div>

            <Block className="mb-5">
                <PriceForm />
            </Block>
        </>
    )
}
