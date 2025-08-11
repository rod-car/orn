import { ReactNode } from 'react'
import { Block, PageTitle } from 'ui'
import { SiteForm } from '@base/pages/Prices'
import { PrimaryLink } from '@base/components'

export function SiteAdd(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un site">
                <PrimaryLink permission="site.view" to="/prices/sites/list" icon='list'>
                    Liste des sites
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <SiteForm />
            </Block>
        </>
    )
}
