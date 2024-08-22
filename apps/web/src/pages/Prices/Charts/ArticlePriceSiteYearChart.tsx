import { useApi } from 'hooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { config } from '@base/config'
import { Select, Spinner } from 'ui'
import { generateColor } from '@base/utils'
import { Selected } from '@base/pages/Prices'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { reverseYears } from 'functions'
import { toast } from 'react-toastify'

ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
)

export function ArticlePriceSiteYearChart(): ReactNode {
    const [article, setArticle] = useState<number>(0)
    const [queryParams, setQueryParams] = useState<{ site_id: number }>({ site_id: 0 })
    const [displayedArticles, setDisplayedArticle] = useState<Article[]>([])

    const { Client: SiteClient, datas: sites } = useApi<Site>({
        baseUrl: config.baseUrl,
        url: '/prices/sites',
        key: 'data'
    })

    const { Client: ArticleClient, datas: articles } = useApi<Article>({
        baseUrl: config.baseUrl,
        url: '/prices/articles',
        key: 'data'
    })

    const { Client: ArticlePriceClient, datas: StateDatas, RequestState } = useApi<{ data: ArticlePrice }>({
        baseUrl: config.baseUrl,
        url: '/prices',
        key: 'data'
    })

    const getArticlePrices = async (params: Record<string, string | number | boolean> | undefined = undefined) => {
        if (params === undefined) {
            if (queryParams.site_id !== 0) await ArticlePriceClient.get(queryParams, '/article-price-site-year')
        } else {
            if (params?.site_id !== 0) await ArticlePriceClient.get(params, '/article-price-site-year')
        }
    }

    useEffect(() => {
        getArticlePrices()
        SiteClient.get()
        ArticleClient.get()
    }, [])

    const chartRef = useRef()

    const data = useMemo(() => {
        const data = StateDatas.data
        const labels = reverseYears.map(year => year)

        const datasets = displayedArticles.map((article, key) => {
            return {
                label: article.designation,
                data: reverseYears.map(year => data ? (data[article.designation] === undefined ? 0 : data[article.designation][year]) : 0),
                backgroundColor: generateColor(article.designation ?? '', key)
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
                text: `EVOLUTION DES PRIX DANS UN SITE ANNUEL`,
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
                suggestedMax: 2000
            },
            x: {
                title: {
                    display: true,
                    text: "Année"
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
                ...queryParams,
                [target.name]: target.value
            }
            setQueryParams({ ...temp })
            getArticlePrices({ ...temp })
        }
    }

    const removeArticle = (id: number) => {
        setDisplayedArticle([...displayedArticles.filter(article => article.id !== id)])
    }

    return (
        <>
            <div className="shadow-lg rounded p-4">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h4 className="text-muted">Prix des articles par Site annuel</h4>
                </div>
                <div className="row mb-5">
                    <div className="col-6">
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
                    <div className="col-6">
                        <Select
                            controlled
                            label="Site"
                            name="site_id"
                            placeholder="Selectionner un site"
                            value={queryParams.site_id}
                            options={sites}
                            config={{ optionKey: 'id', valueKey: 'name' }}
                            onChange={({ target }) => handleChange(target)}
                        />
                    </div>
                </div>

                <div className="mb-5" style={{ display: 'grid', rowGap: '20px', gridTemplateColumns: 'auto auto auto auto auto' }}>
                    {displayedArticles.map(article => <Selected key={article.id} data={article} onRemove={() => removeArticle(article.id)} />)}
                </div>

                {RequestState.loading && <Spinner className="text-center w-100" />}
                {data && (
                    <div className="custom-chart" ref={chartRef}>
                        <Line options={options} data={data} />
                    </div>
                )}
            </div>
        </>
    )
}