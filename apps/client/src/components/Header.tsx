import { ReactNode } from "react";
import Link from "next/link.js";

export function Header(): ReactNode {
    return <header className="header navbar-area bg-white">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-12">
                    <nav className="navbar navbar-expand-lg">
                        <Link className="navbar-brand" href="/">
                            <img style={{ width: 50, height: "auto" }} src="/img/logo/logo.png" alt="Logo" />
                            <span className="ml-3 font-weight-bold">ORN Atsinanana</span>
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="toggler-icon"></span>
                            <span className="toggler-icon"></span>
                            <span className="toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                            <ul id="nav" className="navbar-nav ml-auto">
                                <li className="nav-item"><Link href="/">Accueil</Link></li>
                                <li className="nav-item"><Link href="/activites">Cantine scolaire</Link></li>
                                <li className="nav-item"><Link href="/projets">Projets</Link></li>
                                <li className="nav-item"><Link href="/a-propos">A propos</Link></li>
                                <li className="nav-item"><Link href="/contact">Contact</Link></li>
                                <li className="nav-item custom-dropdown">
                                    <a className="custom-dropdown-toggle" id="navbarCantine" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Cantine
                                    </a>
                                    <ul className="custom-dropdown-menu" aria-labelledby="navbarCantine">
                                        <li><a className="custom-dropdown-item" href="#">Action</a></li>
                                        <li><a className="custom-dropdown-item" href="#">Another action</a></li>
                                    </ul>
                                </li>
                            </ul>
                            <div className="header-btn">
                                <Link target="_blank" href="https://admin.orn-atsinanana.mg" className="theme-btn">Se connecter</Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </header>
}