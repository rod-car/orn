import { PrimaryLink } from '@base/components'
import { Block, PageTitle } from 'ui'
import { ArticleForm } from '@base/pages/Prices'
import { ReactNode } from 'react'

export function ArticleAdd(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un article">
                <PrimaryLink to="/prices/articles/list"icon='list'>
                    Liste des articles
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <ArticleForm />
            </Block>
        </>
    )
}
