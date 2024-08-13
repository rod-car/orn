import { NavLink } from 'react-router-dom'
import { Block } from 'ui'
import { ActivityForm } from '@base/pages/Activities'

export function ActivityTypeAdd(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un type d'activité</h2>
                <NavLink to="/activities/types" className="btn btn-primary">
                    <i className="bi bi-list me-2"></i>Liste des types d'activités
                </NavLink>
            </div>

            <Block className="mb-5">
                <ActivityForm />
            </Block>
        </>
    )
}
