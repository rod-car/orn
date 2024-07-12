import { useApi } from 'hooks'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { config } from '@base/config'
import { Button, Select, Spinner } from 'ui'

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
// import { useSearchParams } from 'react-router-dom'
import { generateColor } from '@base/utils'
import { toast } from 'react-toastify'
import { Selected } from '@base/pages/Prices'

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const
        },
        title: {
            display: true,
            text: 'PRIX PAR SITE DANS UNE ANNEE',
            font: {
                size: 14
            }
        }
    },
    scales: {
        y: {
            title: {
                display: true,
                text: "Montant (Ar)"
            },
            ticks: {
                font: {
                    weight: 'bold',
                    size: 13
                }
            }
        },
        x: {
            ticks: {
                font: {
                    weight: 'bold',
                    size: 13
                }
            }
        }
    }
}

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

export function ArticlePriceSitesChart(): ReactNode {
    const [siteId, setSiteId] = useState<number>(0)
    const [params, setParams] = useState<{ year: number, article_id: number }>({ article_id: 0, year: 2024 })
    const [displayedSites, setDisplayedSites] = useState<Site[]>([])

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

    const {
        Client: ArticlePriceClient,
        datas: StateDatas,
        RequestState
    } = useApi<{ data: ArticlePrice }>({
        baseUrl: config.baseUrl,
        
        url: '/prices',
        key: 'data'
    })

    const getArticlePrices = async (queryParams?: { year: number, article_id: number }) => {
        if (queryParams === undefined) {
            if (params.year !== 0 && params.article_id !== 0) await ArticlePriceClient.get(params, '/article-price-sites')
        } else {
            if (queryParams?.year !== 0 && queryParams?.article_id !== 0) await ArticlePriceClient.get(queryParams, '/article-price-sites')
        }
    }

    useEffect(() => {
        getArticlePrices()
        ArticleClient.get()
        ArticleClient.get()
        SiteClient.get()
    }, [])

    // const chartRef = useRef()

    const data = useMemo(() => {
        const data = StateDatas.data
        const labels = months.map(month => month.label)

        const datasets = displayedSites.map((site, key) => {
            return {
                label: site.name,
                data: months.map(month => data ? (data[site.name] === undefined ? 0 : data[site.name][month.id]) : 0),
                backgroundColor: generateColor(site.name ?? '', key + 1000)
            }
        })
        return {
            labels,
            datasets
        }
    }, [articles, sites, StateDatas, displayedSites])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: true,
                text: `COMPARAISON DES PRIX D'UN ARTICLE DANS LES SITES`,
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
        if (target.name === 'site_id') {
            const id = parseInt(target.value)
            const exist = displayedSites.find(site => site.id === id)
            if (exist === undefined) {
                const selectedSite = sites.find(site => site.id === id)
                if (selectedSite !== undefined) {
                    setDisplayedSites([...displayedSites, selectedSite])
                }
            } else {
                toast("Site déjà affiché", {
                    position: config.toastPosition,
                    type: 'error'
                })
            }
            setSiteId(0)
        } else {
            const temp = {
                ...params,
                [target.name]: target.value
            }
            setParams({ ...temp })
            getArticlePrices({ ...temp })
        }
    }

    const removeSite = (id: number) => {
        setDisplayedSites([...displayedSites.filter(site => site.id !== id)])
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
                            name="article_id"
                            placeholder="Selectionner un article"
                            value={params.article_id}
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
                            value={siteId}
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
                    {displayedSites.map(site => <Selected key={site.id} data={site} onRemove={() => removeSite(site.id)} />)}
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