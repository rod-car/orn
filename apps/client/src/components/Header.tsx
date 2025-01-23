import { ReactNode } from "react";
import Link from "next/link.js";

/*function onScroll() {
    let sections = document.querySelectorAll('.page-scroll');
    let scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

    for (let i = 0; i < sections.length; i++) {
        let currLink = sections[i];
        let val = currLink.getAttribute('href') as string;
        let refElement = document.querySelector(val) as HTMLLinkElement;
        let scrollTopMinus = scrollPos + 73;
        if (refElement && refElement.offsetTop <= scrollTopMinus && (refElement.offsetTop + refElement.offsetHeight > scrollTopMinus)) {
            document.querySelector('.page-scroll')?.classList.remove('active');
            currLink.classList.add('active');
        } else {
            currLink.classList.remove('active');
        }
    }
};*/

export function Header(): ReactNode {
    /*const [links, setLinks] = useState([
        {
            title: "Accueil",
            link: "#accueil",
            active: true
        },
        {
            title: "À propos",
            link: "/a-propos",
            active: false
        },
        {
            title: "Activites",
            link: "/activites",
            active: false
        },
        {
            title: "Projets",
            link: "/projets",
            active: false
        },
        {
            title: "Partenaires",
            link: "#partenaries",
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

    useEffect(() => {
        /*const cu = new counterUp({
            start: 0,
            duration: 2000,
            intvalues: true,
            interval: 100,
        });

        cu.start();*/

        /*document.addEventListener('scroll', onScroll);

        return () => document.removeEventListener('scroll', onScroll)
    }, [])*/

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
                                <li className="nav-item"><Link href="/activites">Activites</Link></li>
                                <li className="nav-item"><Link href="/projets">Projets</Link></li>
                                <li className="nav-item"><Link href="/a-propos">A propos</Link></li>
                                <li className="nav-item"><Link href="/contact">Contact</Link></li>
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