import { ReactNode } from "react";
import { Link } from "@base/components";

export function InternalServerError(): ReactNode {
    return <div className="app-404-page">   	
        <div className="container mb-5">
            <div className="row">
                <div className="col-12 col-md-11 col-lg-7 col-xl-6 mx-auto">
                    <div className="app-branding text-center mb-5">
                        <a className="app-logo" href="index.html">
                            <img className="logo-icon me-2" src="assets/images/app-logo.svg" alt="logo" />
                            <span className="logo-text">PORTAL</span>
                        </a>
                    </div>
                    <div className="app-card p-5 text-center shadow-sm">
                        <h1 className="page-title mb-4">500<br /><span className="font-weight-light">Erreur interne du serveur</span></h1>
                        <div className="mb-4">
                            Une erreur est survenue
                        </div>
                        <Link permission="dashboard.view" className="btn app-btn-primary" to="/">Retourner à la page d'accueil</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

