import { NavLink } from '@base/components'
import { Block } from 'ui'
import { ArticleForm } from '@base/pages/Prices'
import { ReactNode } from 'react'

export function ArticleAdd(): ReactNode {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un article</h2>
                <NavLink to="/prices/articles/list" className="btn btn-primary">
                    <i className="bi bi-list me-2"></i>Liste des articles
                </NavLink>
            </div>

            <Block className="mb-5">
                <ArticleForm />
            </Block>
        </>
    )
}
