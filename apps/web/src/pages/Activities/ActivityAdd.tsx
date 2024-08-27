import { Block, PageTitle } from 'ui'
import { ReactNode } from 'react'
import { ActivityForm } from './ActivityForm'
import { PrimaryLink } from '@base/components'

export function ActivityAdd(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un activité">
                <PrimaryLink to="/activities/admin/list" icon="list">
                    Liste des activités
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <ActivityForm />
            </Block>
        </>
    )
}
