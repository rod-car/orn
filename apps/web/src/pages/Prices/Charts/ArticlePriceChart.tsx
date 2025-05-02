/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { config } from '@base/config'
import { Select, Spinner } from 'ui'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { months, years } from 'functions'
import { useSearchParams } from 'react-router-dom'
import { generateColor } from '@base/utils'
import { toast } from 'react-toastify'
import { Selected } from '@base/pages/Prices'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
)

export function ArticlePriceChart(): ReactNode {
    const [article, setArticle] = useState<number>(0)
    const [params, setParams] = useState<{ year: number, site_id: number }>({ site_id: 0, year: 2024 })
    const [displayedArticles, setDisplayedArticle] = useState<Article[]>([])
    const [searchParams, setSearchParams] = useSearchParams(params as unknown as URLSearchParams)

    const { Client: SiteClient, datas: sites } = useApi<Site>({
        
        url: '/prices/sites',
        key: 'data'
    })

    const { Client: ArticleClient, datas: articles } = useApi<Article>({
        
        url: '/prices/articles',
        key: 'data'
    })

    const {
        Client: ArticlePriceClient,
        datas: StateDatas,
        RequestState
    } = useApi<{ data: ArticlePrice }>({
        
        url: '/prices',
        key: 'data'
    })

    const getSearchParams = () => {
        let searchParamsObject = {};

        for (const [key, value] of searchParams.entries()) {
            searchParamsObject = { ...searchParamsObject, [key]: value }
        }

        if (Object.values(searchParamsObject).length > 0) {
            setParams({ ...params, ...searchParamsObject })
            return searchParamsObject
        }
        return undefined
    }

    const getArticlePrices = async (params: Record<string, string | number | boolean> | undefined = undefined) => {
        if (params === undefined) await ArticlePriceClient.get(params, '/article-price-month')
        else await ArticlePriceClient.get(params, '/article-price-month')
    }

    useEffect(() => {
        getArticlePrices(getSearchParams())
        SiteClient.get()
        ArticleClient.get()
    }, [])

    const data = useMemo(() => {
        const data = StateDatas.data
        const labels = months.map(month => month.label)

        const datasets = displayedArticles.map((article, key) => {
            return {
                label: article.designation,
                data: months.map(month => data ? (data[article.designation] === undefined ? 0 : data[article.designation][month.id]) : 0),
                backgroundColor: generateColor(article.designation ?? '', key + 1000)
            }
        })
        return {
            labels,
            datasets
        }
    }, [StateDatas, displayedArticles])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: true,
                text: `EVOLUTION DES PRIX D'UN SITE DANS UN AN`,
                font: {
                    size: 14
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Prix (Ar)"
                },
                ticks: {
                    font: {
                        weight: 'bold',
                        size: 13
                    }
                },
                suggestedMax: 2000,
                suggestedMin: 0
            },
            x: {
                title: {
                    display: true,
                    text: 'Mois'
                },
                ticks: {
                    font: {
                        weight: 'bold',
                        size: 13
                    }
                }
            }
        }
    }

    const handleChange = (target: EventTarget & HTMLSelectElement) => {
        if (target.name === 'article') {
            const id = parseInt(target.value)
            const exist = displayedArticles.find(article => article.id === id)
            if (exist === undefined) {
                const selectedArticle = articles.find((article) => article.id === id)
                if (selectedArticle !== undefined) {
                    setDisplayedArticle([...displayedArticles, selectedArticle])
                }
            } else {
                toast("Article déjà affiché", {
                    position: config.toastPosition,
                    type: 'error'
                })
            }
            setArticle(0)
        } else {
            const temp = {
                ...params,
                [target.name]: target.value
            }
            setSearchParams({ ...temp })
            setParams({ ...temp })
            getArticlePrices({ ...temp })
        }
    }

    const removeArticle = (id: number) => {
        setDisplayedArticle([...displayedArticles.filter(article => article.id !== id)])
    }

    return (
        <>
            <div className="shadow-lg rounded p-4">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <h4 className="text-muted">Prix des articles par Site dans une année</h4>
                </div>
                <div className="row mb-5">
                    <div className="col-4">
                        <Select
                            controlled
                            label="Articles"
                            name="article"
                            placeholder="Selectionner un article"
                            value={article}
                            options={articles}
                            config={{ optionKey: 'id', valueKey: 'designation' }}
                            onChange={({ target }) => handleChange(target)}
                        />
                    </div>
                    <div className="col-4">
                        <Select
                            controlled
                            label="Site"
                            name="site_id"
                            placeholder="Selectionner un site"
                            value={params.site_id}
                            options={sites}
                            config={{ optionKey: 'id', valueKey: 'name' }}
                            onChange={({ target }) => handleChange(target)}
                        />
                    </div>
                    <div className="col-4">
                        <Select
                            controlled
                            label="Année"
                            name="year"
                            placeholder="Selectionner une année"
                            value={params.year}
                            options={years}
                            onChange={({ target }) => handleChange(target)}
                        />
                    </div>
                </div>

                <div className="mb-5" style={{ display: 'grid', rowGap: '20px', gridTemplateColumns: 'auto auto auto auto auto' }}>
                    {displayedArticles.map(article => <Selected key={article.id} data={article} onRemove={() => removeArticle(article.id)} />)}
                </div>

                {RequestState.loading && <Spinner className="text-center w-100" />}
                {data && (
                    <div className="custom-chart" ref={null}>
                        <Line options={options} data={data} />
                    </div>
                )}
            </div>
        </>
    )
}