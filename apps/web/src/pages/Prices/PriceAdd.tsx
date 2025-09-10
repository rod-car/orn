import { PrimaryLink } from '@base/components'
import { Block, PageTitle } from 'ui'
import { PriceForm } from './PriceForm'
import { ReactNode } from 'react'

export function PriceAdd(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un prix d'articles">
                <PrimaryLink permission="price.view" to="/prices/list" icon="list">
                    Liste des prix d'articles
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <PriceForm />
            </Block>
        </>
    )
}
