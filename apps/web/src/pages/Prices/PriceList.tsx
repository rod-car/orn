/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect, useState } from "react";
import { Block, Button, PageTitle, Select } from "ui";
import { Link, Pagination, PrimaryLink } from '@base/components'
import { useSearchParams } from "react-router-dom";
import { formatPrice, range } from "functions";
import Skeleton from "react-loading-skeleton";

export function PriceList(): ReactNode {
    const [searchParams, setSearchParams] = useSearchParams()

    const { Client, datas: articlePrices, RequestState } = useApi<ArticlePrice>({
        url: '/prices',
        key: 'data'
    })

    const { Client: SiteClient, datas: sites } = useApi<Site>({
        url: '/prices/sites',
        key: 'data'
    })

    const { Client: ArticleClient, datas: articles } = useApi<Site>({
        url: '/prices/articles',
        key: 'data'
    })

    const { Client: UnitClient, datas: units } = useApi<Site>({
        url: '/prices/units',
        key: 'data'
    })

    const [queryParams, setQueryParams] = useState({
        paginate: true, perPage: 15, site_id: 0, article_id: 0, unit_id: 0
    })

    const getArticlePrices = async (params: Record<string, string | number | boolean> | undefined = undefined) => {
        if (params === undefined) await Client.get(queryParams)
        else await Client.get(params)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({
            ...queryParams,
            page: data.page
        })
    }

    const updateQueryParam = (value: string, key: string) => {
        const temp = { ...queryParams, [key]: parseInt(value) }
        setSearchParams({ ...temp })
        setQueryParams({ ...temp })
        getArticlePrices(temp)
    }

    const getSearchParams = () => {
        let searchParamsObject = {};

        for (const [key, value] of searchParams.entries()) {
            searchParamsObject = { ...searchParamsObject, [key]: value }
        }

        if (Object.values(searchParamsObject).length > 0) {
            setQueryParams({ ...queryParams, ...searchParamsObject })
            return searchParamsObject
        }
        return undefined
    }

    useEffect(() => {
        SiteClient.get()
        ArticleClient.get()
        UnitClient.get()
        getArticlePrices(getSearchParams())
    }, [])

    return <>
        <PageTitle title="Liste des prix d'articles">
            <div className="d-flex justify-content-between">
                <Button permission="price.view" onClick={() => getArticlePrices()} icon="arrow-clockwise" type="button" mode="secondary" className="me-2">Recharger</Button>
                <PrimaryLink permission="price.create" to="/prices/add" icon="plus-lg">
                    Ajouter un prix d'articles
                </PrimaryLink>
            </div>
        </PageTitle>

        <Block className="mb-5">
            <table className="table table-striped table-bordered table-hover text-sm">
                <thead>
                    <tr>
                        <th>Site</th>
                        <th>Article</th>
                        <th>Unité</th>
                        <th>Elements</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><Select controlled onChange={({ target }) => updateQueryParam(target.value, 'site_id')} value={queryParams.site_id} options={sites} config={{ optionKey: 'id', valueKey: 'name' }} placeholder="Tous les sites" /></td>
                        <td><Select controlled onChange={({ target }) => updateQueryParam(target.value, 'article_id')} value={queryParams.article_id} options={articles} config={{ optionKey: 'id', valueKey: 'designation' }} placeholder="Tous les articles" /></td>
                        <td><Select controlled onChange={({ target }) => updateQueryParam(target.value, 'unit_id')} value={queryParams.unit_id} options={units} config={{ optionKey: 'id', valueKey: 'name' }} placeholder="Tous les unités" /></td>
                        <td><Select controlled onChange={({ target }) => updateQueryParam(target.value, 'perPage')} value={queryParams.perPage} options={[10, 15, 20, 30, 40, 50, 60, 70]} placeholder="Tous les éléments" /></td>
                    </tr>
                </tbody>
            </table>
        </Block>

        <Block>
            <table className="table table-striped table-bordered mb-4 table-hover text-sm">
                <thead>
                    <tr>
                        <th>Site</th>
                        <th>Article</th>
                        <th>Unité</th>
                        <th>Prix (Ar)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {RequestState.loading && <ArticlePriceLoading tdCount={5} />}
                    {articlePrices && articlePrices.data?.map((articlePrice: ArticlePrice) => <tr key={articlePrice.id}>
                        <td>{articlePrice.site?.name}</td>
                        <td>{articlePrice.article?.designation}</td>
                        <td>{articlePrice.unit?.name}</td>
                        <td>{formatPrice(articlePrice.price)}</td>
                        <td><Link to="" className="btn btn-primary btn-sm"><i className="bi bi-folder"></i></Link></td>
                    </tr>)}
                </tbody>
            </table>
            {articlePrices?.total > articlePrices?.per_page && <Pagination changePage={changePage} data={articlePrices} />}
        </Block>
    </>
}

function ArticlePriceLoading({ tdCount = 4 }) {
    return range(10).map(index => <tr key={index * 1}>
        {range(tdCount).map(tdindex => <td key={tdindex * -1}><Skeleton height={30} /></td>)}
    </tr>)
}