import { NavLink } from 'react-router-dom'
import { Block } from 'ui'
import { TypeActivityForm } from '@renderer/pages/Activities'

export function ActivityTypeEdit(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un activité</h2>
                <NavLink to="/activities/types" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des types d'activités
                </NavLink>
            </div>

            <Block className="mb-5">
                <TypeActivityForm />
            </Block>
        </>
    )
}
