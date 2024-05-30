import { useApi } from 'hooks'
import { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Block } from 'ui'
import { config, getToken } from '@renderer/config'
import { ArticleForm } from '@renderer/pages/Prices'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function ArticleEdit(): JSX.Element {
    const { Client, data: article } = useApi<Article>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/prices/articles'
    })

    const { id } = useParams()

    const getArticles = async (id: number): Promise<void> => {
        await Client.find(id)
    }

    useEffect(() => {
        getArticles(parseInt(id as string))
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                {article ? (
                    <h3 className="m-0">{article.designation}</h3>
                ) : (
                    <Skeleton count={1} style={{ height: 40 }} containerClassName="w-50" />
                )}
                <NavLink to="/prices/articles/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des articles
                </NavLink>
            </div>

            <Block className="mb-5">
                {article ? (
                    <ArticleForm editedArticle={article} />
                ) : (
                    <Skeleton style={{ height: 40 }} count={4} />
                )}
            </Block>
        </>
    )
}
