/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, DangerButton, PageTitle } from "ui";
import { config } from '@base/config'
import { ArticleLoading, EditLink, PrimaryLink } from "@base/components";
import { Pagination } from '@base/components'
import { confirmAlert } from "react-confirm-alert";
import { toast } from "@base/ui";

export function ArticleList(): ReactNode {
    const { Client, datas: articles, RequestState } = useApi<Article>({
        url: '/prices/articles'
    })

    const queryParams = {
        paginate: true,
        perPage: 15
    }

    const getArticles = async () => {
        await Client.get(queryParams)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({
            ...queryParams,
            page: data.page
        })
    }

    useEffect(() => {
        getArticles()
    }, [])

    const handleDelete = async (id: number): Promise<void> => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await Client.destroy(id)
                        if (response.ok) {
                            toast('Enregistré', {
                                closeButton: true,
                                type: 'success'
                            })
                            getArticles()
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error'
                        })
                }
            ]
        })
    }

    return <>
        <PageTitle title="Liste des articles">
            <PrimaryLink permission="article.create" to="/prices/articles/add" icon="plus-lg">
                Nouveau article
            </PrimaryLink>
        </PageTitle>

        {RequestState.loading ? <ArticleLoading /> : <Block className="mb-4">
            <table className="table table-striped table-bordered table-hover text-sm">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Désignation</th>
                        <th>Unité</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {articles && articles.data?.map((article: Article) => <tr key={article.id}>
                        <td>{article.code ?? '-'}</td>
                        <td>{article.designation}</td>
                        <td>{article.unit ? article.unit.name : '-'}</td>
                        <td>{article.description ?? '-'}</td>
                        <td className="text-nowrap">
                            <EditLink permission="article.edit" to={`/prices/articles/edit/${article.id}`} />
                            <DangerButton
                                permission="article.delete"
                                icon="trash"
                                size="sm"
                                onClick={(): void => {
                                    handleDelete(article.id)
                                }}
                            />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>}
        {articles?.meta?.total > articles?.meta?.per_page && <Pagination changePage={changePage} data={articles} />}
    </>
}