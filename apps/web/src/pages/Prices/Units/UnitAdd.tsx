import { PrimaryLink } from '@base/components'
import { Block, PageTitle } from 'ui'
import { UnitForm } from '@base/pages/Prices'
import { ReactNode } from 'react'

export function UnitAdd(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un unité">
                <PrimaryLink permission="unit.view" to="/prices/units/list" icon="list">
                    Liste des unités
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <UnitForm />
            </Block>
        </>
    )
}
