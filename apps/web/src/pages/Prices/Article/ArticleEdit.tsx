import { useApi } from 'hooks'
import { ReactNode, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Block, PageTitle } from 'ui'
import { PrimaryLink } from "@base/components"
import { ArticleForm } from '@base/pages/Prices'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function ArticleEdit(): ReactNode {
    const { Client, data: article } = useApi<Article>({
        url: '/prices/articles',
        key: 'data'
    })

    const { id } = useParams()

    const getArticle = async (id: number): Promise<void> => {
        await Client.find(id)
    }

    useEffect(() => {
        getArticle(parseInt(id as string))
    }, [])

    return (
        <>
            <PageTitle
                title={article ? article.designation : <Skeleton count={1} style={{ height: 40 }} containerClassName="w-50" />}
            >
                <PrimaryLink permission="article.view" to="/prices/articles/list" icon="list">
                    Liste des articles
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                {article ? <ArticleForm editedArticle={article} /> : <Skeleton style={{ height: 40 }} count={4} />}
            </Block>
        </>
    )
}
