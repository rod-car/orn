import { NavLink } from '@base/components'
import { Block, PageTitle } from 'ui'
import { TypeActivityForm } from '@base/pages/Activities'
import { ReactNode } from 'react'

export function ActivityTypeEdit(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter une activite">
                <NavLink to="/activities/types" className="btn btn-primary">
                    <i className="bi bi-list me-2"></i>Liste des types d'activités
                </NavLink>
            </PageTitle>

            <Block className="mb-5">
                <TypeActivityForm />
            </Block>
        </>
    )
}
