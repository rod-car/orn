import { ReactNode } from "react";
import Link from "next/link.js";
import { config } from "@/utils/config";

type ServiceType = {
    data: {
        id: number
        title: string
        description: string
        icon: string
        link: string
    }[]
}

export async function Header() {
    let services: ServiceType = { data: [] }

    try {
        const servicesData = await fetch(config.apiUrl + '/services', {
            next: { revalidate: 0 },
            cache: "no-cache"
        })

        services = await servicesData.json()
    } catch (e) {
    }

    return <header className="header navbar-area bg-white">
        <div className="container-fluid">
            <div className="row align-items-center">
                <nav className="navbar navbar-expand-lg">
                    <Link className="navbar-brand" href="/">
                        <img style={{ width: 50, height: "auto" }} src="/img/logo/logo.png" alt="Logo" />
                        <span className="ml-3 text-x-large font-weight-bold">Cantine scolaire</span>
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
                            <li className="nav-item"><Link href="/a-propos">A propos</Link></li>
                            <li className="nav-item custom-dropdown">
                                <a className="custom-dropdown-toggle" id="navbarActivities" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Activités
                                </a>
                                <ul className="custom-dropdown-menu" aria-labelledby="navbarActivities">
                                    {services.data && services.data.map((service, index) => <li key={index}>
                                        <Link className="custom-dropdown-item" href={service.link}>{service.title}</Link>
                                    </li>)}
                                </ul>
                            </li>
                            <li className="nav-item"><Link href="/actualites">Actualités</Link></li>
                        </ul>
                        <div className="header-btn">
                            <Link target="_blank" href="https://admin.orn-atsinanana.mg" className="theme-btn">Se connecter</Link>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </header>
}