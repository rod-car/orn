"use client"
import { ReactNode, useState } from "react";

export function Header(): ReactNode {
    const [links, setLinks] = useState([
        {
            title: "Accueil",
            link: "#home",
            active: true
        },
        {
            title: "A propos",
            link: "#about",
            active: false
        },
        {
            title: "Activites",
            link: "#services",
            active: false
        },
        {
            title: "Partenaires",
            link: "#team",
            active: false
        },
        {
            title: "Partenaires",
            link: "#portfolio",
            active: false
        },
        {
            title: "Contact",
            link: "#contact",
            active: false
        }
    ])

    const changeActive = (index: number) => {
        const temp = links.map((link, key) => {
            link.active = false
            if (key === index) link.active = true

            return link
        })

        setLinks(temp)
    }

    return <header className="header navbar-area bg-white">
    <div className="container">
        <div className="row align-items-center">
            <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand" href="index.html">
                        <img style={{width: 50, height: 'auto'}} src="/img/logo/logo.png" alt="Logo" />
                        <span className="ml-3 font-weight-bold">ORN Atsinanana</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="toggler-icon"></span>
                        <span className="toggler-icon"></span>
                        <span className="toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                        <ul id="nav" className="navbar-nav ml-auto">
                            {links.map((link, index) => <li key={index} onClick={() => changeActive(index)} className="nav-item">
                                <a className={`page-scroll ${link.active && 'active'}`} href={link.link}>{link.title}</a>
                            </li>)}
                        </ul>
                        <div className="header-btn">
                            <a href="javascript:void(0)" className="theme-btn">Voir la plateforme</a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </div>
</header>
}