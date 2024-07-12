import { NavLink } from 'react-router-dom'
import { Block } from 'ui'
import { UnitForm } from '@base/pages/Prices'

export function UnitAdd(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un unité</h2>
                <NavLink to="/prices/units/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des unités
                </NavLink>
            </div>

            <Block className="mb-5">
                <UnitForm />
            </Block>
        </>
    )
}
