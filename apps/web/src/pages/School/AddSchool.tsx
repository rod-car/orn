import { NavLink } from 'react-router-dom'
import { Block } from 'ui'
import { SchoolForm } from './SchoolForm'

export function AddSchool(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un établissement</h2>
                <NavLink to="/anthropo-measure/school/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des établissements
                </NavLink>
            </div>

            <Block className="mb-5">
                <SchoolForm />
            </Block>
        </>
    )
}
