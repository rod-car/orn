import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArticlePriceChart, ArticlePriceSiteChart, ArticlePriceSiteYearChart, ArticlePriceSitesChart } from "@base/pages/Prices"

export function PriceHome(): ReactNode {
    return <>
        <div className="mb-5 d-flex justify-content-between align-items-center">
            <h2>Statistique des prix</h2>
            <Link to="/prices/list" className="btn primary-link">
                <i className="fa fa-list me-2"></i>Tous les prix d'articles
            </Link>
        </div>
        <div className="mb-5">
            <ArticlePriceSiteYearChart />
        </div>
        <div className="mb-5">
            <ArticlePriceSiteChart />
        </div>
        <div className="mb-5">
            <ArticlePriceChart />
        </div>
        <ArticlePriceSitesChart />
    </>
}