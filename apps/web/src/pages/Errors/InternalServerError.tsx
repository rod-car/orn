import { ReactNode } from "react"

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
                        <h1 className="page-title mb-4">500<br /><span className="font-weight-light">Page Not Found</span></h1>
                        <div className="mb-4">
                            Sorry, we can't find the page you're looking for. 
                        </div>
                        <a className="btn app-btn-primary" href="index.html">Go to home page</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

