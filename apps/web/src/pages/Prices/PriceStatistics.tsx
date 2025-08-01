/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryLink } from "@base/components";
import { useApi } from "hooks";
import { ReactNode } from "react";
import { useEffect, useState } from 'react';
import { Button, PageTitle } from "ui";
import React from "react";
import Select from 'react-select';

// Types
interface Article {
    id: number;
    designation: string;
    unit: string | null;
}

interface SitePrices {
    commune: string;
    fokontany: string;
    prices: Record<number, number>;
    district?: number; // Added to identify the district in responses
}

interface ResponseData {
    month: number;
    year: number;
    articles: Article[];
    data: SitePrices[];
}

type ViewMode = 'simple' | 'districts' | 'temporal';

const months = [
    'Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona',
    'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'
];

const districts = [
    { id: 1, name: 'Toamasina I' },
    { id: 2, name: 'Toamasina II' },
    { id: 3, name: 'Brickaville' },
    { id: 4, name: 'Mahanoro' },
    { id: 5, name: 'Vatomandry' },
    { id: 6, name: 'Marolambo' }
];

const monthOptions = months.map((m, i) => ({ value: i + 1, label: m }));
const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => ({ value: y, label: y.toString() }));
const districtOptions = districts.map(d => ({ value: d.id, label: d.name }));

// Utility function to calculate average price
const calculateAverage = (data: SitePrices[], articleId: number): string => {
    const prices = data.map(r => r.prices[articleId]).filter(p => p !== undefined && p !== null);
    return prices.length > 0 ? (prices.reduce((sum, p) => sum + p, 0) / prices.length).toFixed(2) : '-';
};

// Utility function to calculate evolution percentage
const calculateEvolution = (oldPrice: number, newPrice: number): number | null => {
    if (!oldPrice || !newPrice) return null;
    return ((newPrice - oldPrice) / oldPrice) * 100;
};

// Utility function to determine evolution color
const getEvolutionColor = (evolution: number | null): string => {
    if (evolution === null) return 'text-muted';
    if (evolution > 10) return 'text-success';
    if (evolution < -10) return 'text-danger';
    return 'text-warning';
};

export function PriceStatistics(): ReactNode {
    // Main states
    const [viewMode, setViewMode] = useState<ViewMode>('simple');
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [district, setDistrict] = useState<number>(4);

    // Comparison states
    const [selectedDistricts, setSelectedDistricts] = useState<number[]>([4]);
    const [selectedMonths, setSelectedMonths] = useState<number[]>([new Date().getMonth() + 1]);
    const [selectedYears, setSelectedYears] = useState<number[]>([new Date().getFullYear()]);

    // UI states
    const [response, setResponse] = useState<ResponseData | null>(null);
    const [comparisonData, setComparisonData] = useState<{ [key: string]: ResponseData }>({});
    const [hiddenArticles, setHiddenArticles] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { Client } = useApi<ArticlePrice>({ url: '/prices' });

    // Fetch data based on view mode
    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (viewMode === 'simple') {
                const res = await Client.get({ month, year, district: district }, "/statistics");
                setResponse(res as unknown as ResponseData);
                setComparisonData({});
            } else if (viewMode === 'districts') {
                const res = await Client.get({ month, year, districts: selectedDistricts }, "/recaps");
                setResponse(res as unknown as ResponseData);
                setComparisonData({});
            } else if (viewMode === 'temporal') {
                const newComparisonData: { [key: string]: ResponseData } = {};
                const periods = selectedYears.flatMap(y => selectedMonths.map(m => ({ month: m, year: y })));
                for (const period of periods) {
                    const key = `${district}-${period.month}-${period.year}`;
                    const res = await Client.get({ month: period.month, year: period.year, districts: [district] }, "/recaps");
                    newComparisonData[key] = res as unknown as ResponseData;
                }
                setComparisonData(newComparisonData);
                setResponse(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [viewMode, month, year, district, selectedDistricts, selectedMonths, selectedYears]);

    // Toggle article visibility
    const toggleArticleVisibility = (id: number) => {
        setHiddenArticles(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    // Export to PDF
    const exportToPDF = async () => {
        setIsExporting(true);
        try {
            const printContent = document.getElementById('price-table-content');
            if (!printContent) return;

            const printWindow = window.open('', '_blank');
            if (!printWindow) return;

            const title = viewMode === 'simple' ? 'Vue Simple' : viewMode === 'districts' ? 'Comparaison Districts' : 'Comparaison Temporelle';
            const districtNames = viewMode === 'districts' 
                ? selectedDistricts.map(id => districts.find(d => d.id === id)?.name).join(', ')
                : districts.find(d => d.id === district)?.name;

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Récapitulatif des prix - ${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                        th { background-color: #f2f2f2; }
                        .text-success { color: green; }
                        .text-danger { color: red; }
                        .text-warning { color: orange; }
                        @media print { @page { orientation: landscape; } }
                    </style>
                </head>
                <body>
                    <h1>Récapitulatif des prix - ${title}</h1>
                    <p>District(s): ${districtNames}</p>
                    ${printContent.innerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
            printWindow.close();
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Render Simple View
    const renderSimpleView = () => {
        if (!response) return null;
        const visibleArticles = response.articles.filter(a => !hiddenArticles.includes(a.id));
        const filteredData = response.data.filter(row => 
            row.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.fokontany.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div id="price-table-content" className="table-responsive">
                <table className="table table-striped table-hover text-sm">
                    <thead>
                        <tr>
                            <th>Commune</th>
                            <th>Fokontany</th>
                            {visibleArticles.map(article => (
                                <th key={article.id}>{article.designation} ({article.unit ?? '-'})</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.commune}</td>
                                <td>{row.fokontany}</td>
                                {visibleArticles.map(article => (
                                    <td key={article.id}>
                                        {row.prices[article.id] ? row.prices[article.id].toLocaleString() : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render Districts Comparison
    const renderDistrictsComparison = () => {
        if (!response) return null;
        const visibleArticles = response.articles.filter(a => !hiddenArticles.includes(a.id));
        const filteredData = response.data.filter(row => 
            row.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.fokontany.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div id="price-table-content" className="table-responsive">
                <table className="table table-striped table-hover text-sm">
                    <thead>
                        <tr>
                            <th>Commune</th>
                            <th>Fokontany</th>
                            {visibleArticles.map(article => (
                                selectedDistricts.map(districtId => (
                                    <th key={`${article.id}-${districtId}`}>
                                        {article.designation} - {districts.find(d => d.id === districtId)?.name}
                                    </th>
                                ))
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.commune}</td>
                                <td>{row.fokontany}</td>
                                {visibleArticles.map(article => 
                                    selectedDistricts.map(districtId => (
                                        <td key={`${article.uid}-${districtId}`}>
                                            {row.district === districtId && row.prices[article.id] 
                                                ? row.prices[article.id].toLocaleString() 
                                                : '-'}
                                        </td>
                                    ))
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render Temporal Comparison (Option A + B combined)
    const renderTemporalComparison = () => {
        if (Object.keys(comparisonData).length === 0) return null;
        const visibleArticles = Object.values(comparisonData)[0].articles.filter(a => !hiddenArticles.includes(a.id));
        const periods = selectedYears.flatMap(y => selectedMonths.map(m => ({ month: m, year: y })))
            .sort((a, b) => a.year - b.year || a.month - b.month);
        const periodKeys = periods.map(p => `${district}-${p.month}-${p.year}`);

        const filteredData: { [key: string]: SitePrices[] } = {};
        periodKeys.forEach(key => {
            filteredData[key] = comparisonData[key]?.data.filter(row => 
                row.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.fokontany.toLowerCase().includes(searchTerm.toLowerCase())
            ) || [];
        });

        return (
            <div id="price-table-content" className="table-responsive">
                <table className="table table-striped table-hover text-sm">
                    <thead>
                        <tr>
                            <th rowSpan={2}>Commune</th>
                            <th rowSpan={2}>Fokontany</th>
                            {visibleArticles.map(article => (
                                <th key={article.id} colSpan={periodKeys.length + 1}>
                                    {article.designation} ({article.unit ?? '-'})
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {visibleArticles.map(article => (
                                <React.Fragment key={article.id}>
                                    {periodKeys.map(key => (
                                        <th key={key}>{months[Number(key.split('-')[1]) - 1]} {key.split('-')[2]}</th>
                                    ))}
                                    <th>Évolution</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(filteredData)[0].map((row, index) => (
                            <tr key={index}>
                                <td>{row.commune}</td>
                                <td>{row.fokontany}</td>
                                {visibleArticles.map(article => {
                                    const prices = periodKeys.map(key => {
                                        const site = filteredData[key].find(d => 
                                            d.commune === row.commune && d.fokontany === row.fokontany
                                        );
                                        return site?.prices[article.id] || 0;
                                    });
                                    const firstPrice = prices[0] || null;
                                    const lastPrice = prices[prices.length - 1] || null;
                                    const evolution = firstPrice && lastPrice ? calculateEvolution(firstPrice, lastPrice) : null;

                                    return (
                                        <React.Fragment key={article.id}>
                                            {prices.map((price, i) => (
                                                <td key={i}>{price ? price.toLocaleString() : '-'}</td>
                                            ))}
                                            <td className={getEvolutionColor(evolution)}>
                                                {evolution !== null ? `${evolution.toFixed(2)}%` : '-'}
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            <PageTitle title="Récapitulatif des Prix">
                <div className="d-flex gap-2">
                    <Button 
                        className="btn btn-success"
                        onClick={exportToPDF}
                        disabled={isExporting || (!response && Object.keys(comparisonData).length === 0)}
                        permission="price.export"
                    >
                        <i className="bi bi-file-pdf me-2"></i>
                        {isExporting ? 'Export en cours...' : 'Export PDF'}
                    </Button>
                    <PrimaryLink permission="price.create" to="/prices/add" icon="plus-lg">
                        Ajouter un prix
                    </PrimaryLink>
                </div>
            </PageTitle>

            {/* View Mode Selection */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5>Mode d'affichage</h5>
                    <div className="btn-group">
                        <input 
                            type="radio" 
                            className="btn-check" 
                            name="viewMode" 
                            id="simple" 
                            checked={viewMode === 'simple'} 
                            onChange={() => setViewMode('simple')} 
                        />
                        <label className="btn btn-outline-primary" htmlFor="simple">Vue Simple</label>
                        <input 
                            type="radio" 
                            className="btn-check" 
                            name="viewMode" 
                            id="districts" 
                            checked={viewMode === 'districts'} 
                            onChange={() => setViewMode('districts')} 
                        />
                        <label className="btn btn-outline-primary" htmlFor="districts">Comparaison Districts</label>
                        <input 
                            type="radio"
                            className="btn-check" 
                            name="viewMode" 
                            id="temporal" 
                            checked={viewMode === 'temporal'} 
                            onChange={() => setViewMode('temporal')} 
                        />
                        <label className="btn btn-outline-primary" htmlFor="temporal">Comparaison Temporelle</label>
                    </div>
                </div>
            </div>

            {/* Advanced Options */}
            <div className={`collapse ${showAdvanced ? 'show' : ''}`}>
                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Configuration</h5>
                    </div>
                    <div className="card-body">
                        {viewMode === 'simple' && (
                            <div className="row">
                                <div className="col-md-4">
                                    <label>Mois</label>
                                    <Select 
                                        options={monthOptions} 
                                        value={monthOptions.find(m => m.value === month)} 
                                        onChange={option => setMonth(option?.value || 1)} 
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label>Année</label>
                                    <Select 
                                        options={yearOptions} 
                                        value={yearOptions.find(y => y.value === year)} 
                                        onChange={option => setYear(option?.value || 2024)} 
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label>District</label>
                                    <Select 
                                        options={districtOptions} 
                                        value={districtOptions.find(d => d.value === district)} 
                                        onChange={option => setDistrict(option?.value || 4)} 
                                    />
                                </div>
                            </div>
                        )}
                        {viewMode === 'districts' && (
                            <div className="row">
                                <div className="col-md-4">
                                    <label>Mois</label>
                                    <Select 
                                        options={monthOptions} 
                                        value={monthOptions.find(m => m.value === month)} 
                                        onChange={option => setMonth(option?.value || 1)} 
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label>Année</label>
                                    <Select 
                                        options={yearOptions} 
                                        value={yearOptions.find(y => y.value === year)} 
                                        onChange={option => setYear(option?.value || 2024)} 
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label>Districts (max 3)</label>
                                    <Select
                                        isMulti
                                        options={districtOptions}
                                        value={districtOptions.filter(d => selectedDistricts.includes(d.value))}
                                        onChange={selected => {
                                            if (selected.length <= 3) {
                                                setSelectedDistricts(selected.map(s => s.value));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        {viewMode === 'temporal' && (
                            <div className="row">
                                <div className="col-md-3">
                                    <label>District</label>
                                    <Select 
                                        options={districtOptions} 
                                        value={districtOptions.find(d => d.value === district)} 
                                        onChange={option => setDistrict(option?.value || 4)} 
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label>Mois (max 6)</label>
                                    <Select
                                        isMulti
                                        options={monthOptions}
                                        value={monthOptions.filter(m => selectedMonths.includes(m.value))}
                                        onChange={selected => {
                                            if (selected.length <= 6) {
                                                setSelectedMonths(selected.map(s => s.value));
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <label>Années (max 3)</label>
                                    <Select
                                        isMulti
                                        options={yearOptions}
                                        value={yearOptions.filter(y => selectedYears.includes(y.value))}
                                        onChange={selected => {
                                            if (selected.length <= 3) {
                                                setSelectedYears(selected.map(s => s.value));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="mt-3">
                            <label>Recherche</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Commune ou Fokontany..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && <div>Chargement...</div>}

            {/* Render Table Based on View Mode */}
            {viewMode === 'simple' && renderSimpleView()}
            {viewMode === 'districts' && renderDistrictsComparison()}
            {viewMode === 'temporal' && renderTemporalComparison()}
        </>
    );
}