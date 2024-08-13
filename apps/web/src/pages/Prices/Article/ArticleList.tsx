import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, Button } from "ui";
import { config } from '@base/config'
import { ArticleLoading, Link } from "@base/components";
import { Pagination } from 'react-laravel-paginex'
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

export function ArticleList(): ReactNode {
    const {
        Client,
        datas: articles,
        RequestState
    } = useApi<Article>({
        baseUrl: config.baseUrl,
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
                                type: 'success',
                                position: config.toastPosition
                            })
                            getArticles()
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error',
                                position: config.toastPosition
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }

    return <>
        <div className="mb-5 d-flex justify-content-between align-items-center">
            <h2>Liste des articles</h2>
            <Link to="/prices/articles/add" className="btn secondary-link me-2">
                <i className="bi bi-plus-lg me-2"></i>Nouveau article
            </Link>
        </div>

        {RequestState.loading ? <ArticleLoading /> : <Block className="mb-4">
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Désignation</th>
                        <th>Prix</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {articles && articles.data?.map((article: Article) => <tr key={article.id}>
                        <td>{article.code ?? '-'}</td>
                        <td>{article.designation}</td>
                        <td>{article.description ?? '-'}</td>
                        <td>-</td>
                        <td className="text-nowrap">
                            <Link
                                className="btn-sm me-2 btn btn-primary"
                                to={`/prices/articles/edit/${article.id}`}
                            >
                                <i className="bi bi-pencil-square"></i>
                            </Link>
                            <Button
                                type="button"
                                mode="danger"
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