import { NavLink } from 'react-router-dom'
import { Block } from 'ui'
import { ArticleForm } from '@renderer/pages/Prices'

export function ArticleAdd(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un activité</h2>
                <NavLink to="/activities/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des activités
                </NavLink>
            </div>

            <Block className="mb-5">
                <ArticleForm />
            </Block>
        </>
    )
}
