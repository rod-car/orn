import { ReactNode, useEffect, useState } from "react";
import { Link } from "@renderer/components";
import { Block, Select } from "ui";
import { years, months } from "functions";
import { useApi } from "hooks";
import { config } from "@renderer/config";

export function PriceHome(): ReactNode {
    const [requestData, setRequestData] = useState({ district: 4 })
    const [year, setYear] = useState(years.at(0))
    const [district, setDistrict] = useState(1)
    const [month, setMonth] = useState(months.at(0)?.id)

    const { Client: DClient, RequestState: DRequestClient, datas: districts, error } = useApi<District>({
        url: '/districts',
        baseUrl: config.baseUrl
    })

    const { Client: AClient, RequestState: ARequestClient, datas: articles } = useApi<Article>({
        url: '/prices/articles',
        baseUrl: config.baseUrl,
        key: 'data'
    })

    const { Client: SClient, RequestState: SRequestState, datas: sites } = useApi<Site>({
        url: '/prices/sites',
        baseUrl: config.baseUrl,
        key: 'data'
    })

    const { Client: RClient, datas: results, error: Rerror } = useApi<Article>({
        url: '/prices/results',
        baseUrl: config.baseUrl,
    })

    useEffect(() => {
        RClient.get({month: month, year: year}, `/${district}`)
    }, [district, month, year])

    useEffect(() => {
        DClient.get()
        SClient.get({ ...requestData })
        AClient.get()
    }, [])

    return <>
        {error && JSON.stringify(error.message)}

        {JSON.stringify(results)}

        <div className="mb-5 d-flex justify-content-between align-items-center">
            <h2>Tableau de bord</h2>
            <Link to="/prices/list" className="btn primary-link">
                <i className="fa fa-list me-2"></i>Tous les prix d'articles
            </Link>
        </div>

        <Block className="d-flex justify-content-between mb-5">
            <div className="w-25">
                <Select options={districts} value={district} config={{ optionKey: 'id', valueKey: 'name' }} loading={DRequestClient.loading} label="District" placeholder={null} controlled onChange={({target}) => setDistrict(parseInt(target.value))} />
            </div>
            <div className="w-25">
                <Select options={months} value={month} label="Mois" placeholder="Tous" controlled onChange={({target}) => setMonth(parseInt(target.value))} />
            </div>
            <div className="w-25">
                <Select options={years} value={year} label="Année" placeholder={null} controlled onChange={({target}) => setYear(parseInt(target.value))} />
            </div>
        </Block>

        {results.length <= 0 && <p className="text-center">Aucune données</p>}
        {Object.keys(results).map((m: string) => {
            const data = results[parseInt(m)]
            return <Block>
                <div className="mb-5 d-flex justify-content-between">
                    <h5>District {districts.find(d => d.id === district)?.name}</h5>
                    <h5>{m && months.find(v => v.id === parseInt(m))?.label} - {year}</h5>
                </div>

                <div className="table-responsive">
                    <table style={{ fontSize: '10pt' }} className="table table-bordered">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="bg-secondary text-white">KAOMININA</th>
                                <th className="bg-secondary text-white">Toby / Fonkontany</th>
                                {articles && articles.map(article => <th className="bg-secondary text-white text-nowrap">{article.designation}</th>)}
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                {articles && articles.map(_article => <th className="text-end">Kapoaka</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {SRequestState.loading && <tr><td colSpan={6} className="text-center">Chargement</td></tr>}
                            {sites && sites.map(site => <tr>
                                <td>{site.commune?.name}</td>
                                <td>{site.name}</td>
                                {articles && articles.map(article => <th className="text-end">{site.name in data ? data[site.name][article.designation] : '-'}</th>)}
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </Block>})}

        {/*<div className="mb-5">
            <ArticlePriceSiteYearChart />
        </div>
        <div className="mb-5">
            <ArticlePriceSiteChart />
        </div>
        <div className="mb-5">
            <ArticlePriceChart />
        </div>
        <ArticlePriceSitesChart />*/}
    </>
}