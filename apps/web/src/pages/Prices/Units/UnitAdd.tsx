import { NavLink } from '@base/components'
import { Block } from 'ui'
import { UnitForm } from '@base/pages/Prices'
import { ReactNode } from 'react'

export function UnitAdd(): ReactNode {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un unité</h2>
                <NavLink to="/prices/units/list" className="btn btn-primary">
                    <i className="bi bi-list me-2"></i>Liste des unités
                </NavLink>
            </div>

            <Block className="mb-5">
                <UnitForm />
            </Block>
        </>
    )
}
