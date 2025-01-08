import { Block, PageTitle } from 'ui'
import { SiteForm } from '@base/pages/Prices'
import { ReactNode } from 'react'
import { Link } from '@base/components'

export function SiteAdd(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un site">
                <Link to="/prices/sites/list" icon='list' className="btn btn-primary">
                    Liste des sites
                </Link>
            </PageTitle>

            <Block className="mb-5">
                <SiteForm />
            </Block>
        </>
    )
}
