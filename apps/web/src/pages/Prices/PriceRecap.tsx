/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryLink } from "@base/components";
import { useApi } from "hooks";
import { ReactNode } from "react";
import { useEffect, useState } from 'react'
import { Block, PageTitle, SecondaryButton } from "ui";

// Types
interface Article {
    id: number
    designation: string
    unit: string | null
}

interface SitePrices {
    commune: string
    fokontany: string
    prices: Record<number, number>
}

interface ResponseData {
    month: number
    year: number
    articles: Article[]
    data: SitePrices[]
}

const months = [
    'Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona',
    'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'
]

export function PriceRecap(): ReactNode {
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [district, setDistrict] = useState<number>(1)
    const [response, setResponse] = useState<ResponseData | null>(null)
    const [hiddenArticles, setHiddenArticles] = useState<number[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isExporting, setIsExporting] = useState<boolean>(false)
    const [hiddenSites, setHiddenSites] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState<'articles' | 'sites'>('articles')

    const { Client, datas: articlePrices, RequestState } = useApi<ArticlePrice>({
        url: '/prices'
    })

    const { Client: DistrictClient, datas: districts, RequestState: DistrictRequestState } = useApi<District>({
        url: '/districts',
        key: 'data'
    })

    const fetchPrices = async () => {
        const res = await Client.get({month: month, year: year, district: district}, "/statistics")
        if (res) setResponse(res as unknown as ResponseData)
    }

    useEffect(() => {
        DistrictClient.get();
    }, [])

    useEffect(() => {
        fetchPrices()
    }, [month, year, district])

    const toggleArticleVisibility = (id: number) => {
        setHiddenArticles(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
    }

    const toggleSiteVisibility = (siteKey: string) => {
        setHiddenSites(prev => prev.includes(siteKey) ? prev.filter(s => s !== siteKey) : [...prev, siteKey])
    }

    const filteredData = response?.data.filter(row => {
        const siteKey = `${row.commune}-${row.fokontany}`
        return !hiddenSites.includes(siteKey) && (
            row.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.fokontany.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }) || []

    const visibleArticles = response?.articles.filter(a => !hiddenArticles.includes(a.id)) || []

    const exportToPDF = async () => {
        setIsExporting(true)
        try {
            // Créer le contenu HTML pour le PDF
            const printContent = document.getElementById('price-table-content')
            if (!printContent) return

            const printWindow = window.open('', '_blank')
            if (!printWindow) return

            const selectedDistrict = districts.find(d => d.id === district)?.name || 'District inconnu'

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Récapitulatif des prix - ${months[month - 1]} ${year}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .header h1 { color: #0066cc; margin: 10px 0; }
                        .header h2 { color: #333; margin: 5px 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                        th { background-color: #f8f9fa; font-weight: bold; }
                        .meta-info { margin-bottom: 20px; }
                        .meta-info span { margin-right: 20px; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>VIDIN'ENTANA ANDAVANANDRO</h1>
                        <h2>${selectedDistrict} - ${months[month - 1]} ${year}</h2>
                    </div>
                    <div class="meta-info">
                        <span><strong>Période:</strong> ${months[month - 1]} ${year}</span>
                        <span><strong>District:</strong> ${selectedDistrict}</span>
                        <span><strong>Généré le:</strong> ${new Date().toLocaleDateString('fr-FR')}</span>
                    </div>
                    ${printContent.innerHTML}
                </body>
                </html>
            `)

            printWindow.document.close()
            printWindow.focus()

            setTimeout(() => {
                printWindow.print()
                printWindow.close()
            }, 500)
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error)
            alert('Erreur lors de l\'export PDF')
        } finally {
            setIsExporting(false)
        }
    }

    const calculateStats = () => {
        if (!response) return { totalSites: 0, totalArticles: 0, avgPrice: 0 }

        const totalSites = response.data.length
        const totalArticles = visibleArticles.length
        return {
            totalSites,
            totalArticles,
            avgPrice: 0
        }
    }

    const stats = calculateStats()

    return <>
        <PageTitle title="Récapitulatif des Prix">
            <div className="d-flex gap-2">
                <SecondaryButton 
                    onClick={exportToPDF}
                    disabled={isExporting || !response}
                    icon="file-pdf"
                    permission="price.export"
                >
                    {isExporting ? 'Export en cours...' : 'Exporter au format PDF'}
                </SecondaryButton>
                <PrimaryLink permission="price.create" to="/prices/add" icon="plus-lg">
                    Ajouter un prix
                </PrimaryLink>
            </div>
        </PageTitle>

        {(RequestState.loading || DistrictRequestState.loading) && (
            <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des données...</p>
            </div>
        )}

        {articlePrices && response && districts && (
            <Block>
                {/* En-tête avec image et titre */}
                <div className="text-center mb-4">
                    <img 
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.iwacu-burundi.org%2Fwp-content%2Fuploads%2F2022%2F11%2FVivres.jpg&f=1&nofb=1&ipt=c3ba3f2f3edad8f629518f338316e05625112e902df3e16507976a28a4531a11" 
                        alt="Marché" 
                        className="img-fluid rounded shadow-sm mb-3" 
                        style={{ maxHeight: 200 }} 
                    />
                    <h2 className="fw-bold text-primary mb-2">VIDIN'ENTANA ANDAVANANDRO</h2>
                    <h4 className="text-uppercase text-muted">
                        {districts.find(d => d.id === district)?.name || 'District'} - {months[response.month - 1]} {response.year}
                    </h4>
                </div>

                {/* Statistiques rapides */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card bg-primary text-white">
                            <div className="card-body text-center">
                                <h5 className="card-title">Sites</h5>
                                <h2 className="mb-0 text-white">{stats.totalSites}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-success text-white">
                            <div className="card-body text-center">
                                <h5 className="card-title">Articles</h5>
                                <h2 className="mb-0 text-white">{stats.totalArticles}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-info text-white">
                            <div className="card-body text-center">
                                <h5 className="card-title">Prix moyen</h5>
                                <h2 className="mb-0 text-white">{stats.avgPrice} Ar</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres et contrôles */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">
                            <i className="bi bi-sliders me-2"></i>
                            Filtres et Options
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Mois:</label>
                                <select 
                                    className="form-select" 
                                    value={month} 
                                    onChange={e => setMonth(Number(e.target.value))}
                                >
                                    {months.map((m, i) => (
                                        <option key={i + 1} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Année:</label>
                                <input 
                                    className="form-control" 
                                    type="number" 
                                    value={year} 
                                    onChange={e => setYear(Number(e.target.value))} 
                                    min="2020" 
                                    max="2030"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">District:</label>
                                <select 
                                    className="form-select" 
                                    value={district} 
                                    onChange={e => setDistrict(Number(e.target.value))}
                                >
                                    {districts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Recherche:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Commune ou Fokontany..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <ul className="nav nav-tabs" id="filterTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('articles')}
                                        type="button"
                                    >
                                        <i className="bi bi-box-seam me-2"></i>
                                        Articles ({visibleArticles.length}/{response.articles.length})
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'sites' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('sites')}
                                        type="button"
                                    >
                                        <i className="bi bi-geo-alt me-2"></i>
                                        Sites ({response.data.length - hiddenSites.length}/{response.data.length})
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content mt-3">
                                {/* Tab Articles */}
                                <div className={`tab-pane fade ${activeTab === 'articles' ? 'show active' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <small className="text-muted">
                                            {visibleArticles.length} sur {response.articles.length} articles sélectionnés
                                        </small>
                                        <div>
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => setHiddenArticles([])}
                                            >
                                                Tout sélectionner
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setHiddenArticles(response.articles.map(a => a.id))}
                                            >
                                                Tout désélectionner
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {response.articles.map(article => (
                                            <div key={article.id} className="col-md-4 col-lg-3 mb-2">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`article-${article.id}`}
                                                        checked={!hiddenArticles.includes(article.id)}
                                                        onChange={() => toggleArticleVisibility(article.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`article-${article.id}`}>
                                                        {article.designation}
                                                        {article.unit && <small className="text-muted"> ({article.unit})</small>}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Sites */}
                                <div className={`tab-pane fade ${activeTab === 'sites' ? 'show active' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <small className="text-muted">
                                            {response.data.length - hiddenSites.length} sur {response.data.length} sites sélectionnés
                                        </small>
                                        <div>
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => setHiddenSites([])}
                                            >
                                                Tout sélectionner
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setHiddenSites(response.data.map(row => `${row.commune}-${row.fokontany}`))}
                                            >
                                                Tout désélectionner
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {response.data.map((row, index) => {
                                            const siteKey = `${row.commune}-${row.fokontany}`
                                            return (
                                                <div key={index} className="col-md-4 col-lg-3 mb-2">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`site-${index}`}
                                                            checked={!hiddenSites.includes(siteKey)}
                                                            onChange={() => toggleSiteVisibility(siteKey)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`site-${index}`}>
                                                            <strong>{row.fokontany}</strong>
                                                            <br />
                                                            <small className="text-muted">{row.commune}</small>
                                                        </label>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tableau des prix */}
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <i className="bi bi-table me-2"></i>
                            Tableau des Prix
                        </h5>
                        <span className="badge bg-primary">
                            {filteredData.length} site(s) affiché(s)
                        </span>
                    </div>
                    <div className="card-body p-0">
                        <div id="price-table-content" className="table-responsive">
                            <table className="table table-hover table-striped mb-0 table-bordered text-sm">
                                <thead className="table-dark">
                                    <tr className="align-middle">
                                        <th rowSpan={2} className="text-left" style={{ minWidth: '120px' }}>
                                            <i className="bi bi-geo-alt me-1"></i>
                                            Commune
                                        </th>
                                        <th rowSpan={2} className="text-left" style={{ minWidth: '120px' }}>
                                            <i className="bi bi-house me-1"></i>
                                            Fokontany
                                        </th>
                                        {visibleArticles.map(article => <th className="text-center text-nowrap" key={article.id} style={{ minWidth: '100px' }}>
                                            <div>{article.designation}</div>
                                        </th>)}
                                    </tr>
                                    <tr>
                                        {visibleArticles.map(article => <th className="text-center text-nowrap" key={article.id} style={{ minWidth: '100px' }}>
                                            <small className="text-muted">({article.unit ?? '-'})</small>
                                        </th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((row, index) => (
                                            <tr key={index}>
                                                <td className="fw-bold">{row.commune}</td>
                                                <td>{row.fokontany}</td>
                                                {visibleArticles.map(article => (
                                                    <td key={article.id} className="text-center">
                                                        {row.prices[article.id] ? (
                                                            <span className="">
                                                                {row.prices[article.id].toLocaleString()} Ar
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">—</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={visibleArticles.length + 2} className="text-center py-4">
                                                <i className="bi bi-search me-2"></i>
                                                Aucun résultat trouvé pour "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Légende */}
                <div className="mt-3">
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Les prix sont exprimés en Ariary (Ar). "—" indique l'absence de données pour cet article.
                    </small>
                </div>
            </Block>
        )}
    </>
}