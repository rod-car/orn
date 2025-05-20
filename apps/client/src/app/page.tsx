import { Activity } from "@/components/Activity"
import Carousel from "@/components/Carousel"
import ClientLogo from "@/components/ClientLogo"
import ServiceBlock from "@/components/ServiceBlock"
import { config } from "@/utils/config"
import Image from "next/image"
import Link from "next/link"

export const dynamic = 'force-dynamic'

type ActivityType = {
    data: {
        images: {
            path: string
        }[],
        id: number
        title: string
        date: string
        details: string
    }[]
}

type ServiceType = {
    data: {
        id: number
        title: string
        description: string
        icon: string
        link: string
    }[]
}

export default async function Home() {
    let activities: ActivityType = { data: [] }
    let services: ServiceType = { data: [] }

    try {
        const servicesData = await fetch(config.apiUrl + '/services', {
            next: { revalidate: 0 },
            cache: "no-cache"
        })

        services = await servicesData.json()
    } catch (e) {
    }

    try {
        const data = await fetch(config.apiUrl + '/activities?imagesCount=4&take=4&orderField=date&orderDirection=desc', {
            next: { revalidate: 0 },
            cache: "no-cache"
        })

        activities = await data.json()
    } catch (e) {
    }

    return <>
        <section id="accueil" className="carousel-section-wrapper">
            <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-ride="carousel">
                <div className="carousel-inner">
                    <Carousel
                        active
                        title="Nutrition scolaire"
                        description="Mise en place de programmes alimentaires équilibrés au sein des établissements scolaires, visant à améliorer la santé et les performances académiques des élèves en leur fournissant des repas adaptés à leurs besoins nutritionnels."
                        background="/img/carousel/nutrition.jpg"
                        more={{ link: "#services", text: "Voir plus" }}
                    />

                    <Carousel
                        title="Jardin scolaire"
                        description="Le jardin scolaire consiste en la culture de plantes au sein des établissements scolaires, avec la collaboration des parents, afin d'enseigner aux élèves les principes d'une alimentation saine et durable."
                        background="/img/carousel/jardin.jpg"
                        more={{ link: "#services", text: "Voir plus" }}
                    />

                    <Carousel
                        title="Mesure anthropométrique"
                        description="La mesure anthropométrique consiste à évaluer les dimensions corporelles des élèves afin de suivre leur croissance et d'identifier les besoins nutritionnels spécifiques pour assurer leur développement optimal."
                        background="/img/carousel/mesure.jpg"
                        more={{ link: "#services", text: "Voir plus" }}
                    />
                </div>

                <a className="carousel-control carousel-control-prev" href="#carouselExampleCaptions" role="button"
                    data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"><i className="lni lni-arrow-left"></i></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control carousel-control-next" href="#carouselExampleCaptions" role="button"
                    data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"><i className="lni lni-arrow-right"></i></span>
                    <span className="sr-only">Suivant</span>
                </a>
            </div>
        </section>

        <section id="activites" className="main-section" style={{ background: "#eff2f9" }}>
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center mb-55">
                            <span>Activités</span>
                            <h2>Les activités récentes</h2>
                            <p>
                                Découvrez les initiatives clés récemment mises en œuvre pour promouvoir le bien-être et la nutrition dans la région.
                            </p>
                            <Link href="/activites" className="theme-btn">Voir toutes les activités</Link>
                        </div>
                    </div>
                </div>

                {activities.data.length === 0 && <p className="text-center">Aucune donnees</p>}

                {activities.data.map((activity, index: number) => {
                    return <div className="bg-white shadow p-5 mb-5 rounded-md" key={activity.id}>
                        <Activity key={activity.id} index={index} activity={activity} />
                    </div>
                })}
            </div>
        </section>

        <section id="missions" className="main-section">
            <div className="container">
                <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center mb-55">
                            <span>Objectif</span>
                            <h2>L'objectif du projet</h2>
                            <p>
                                L'objectif principal de cette initiative est d'améliorer la performance scolaire en renforçant la situation nutritionnelle des élèves.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6 wow fadeInLeft">
                        <div className="feature-box h-100 mb-0 box-style">
                            <div className="feature-icon box-icon-style ">
                                <i className="lni lni-graduation"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4>Améliorer la performance</h4>
                                <p className="text-justify">
                                    Fournir aux élèves des repas équilibrés contenant tous les nutriments essentiels, tels que les protéines, les vitamines et les minéraux, pour soutenir leur croissance et améliorer leurs capacités cognitives.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 ">
                        <div className="feature-box h-100 mb-0 box-style">
                            <div className="feature-icon box-icon-style ">
                                <i className="lni lni-apple"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4>Réduire le TMC</h4>
                                <p className="text-justify">
                                    Assurer un accès constant à des repas nutritifs, conçus pour répondre aux besoins spécifiques des enfants, afin de lutter efficacement contre la malnutrition chronique.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 wow fadeInRight">
                        <div className="feature-box h-100 mb-0 box-style">
                            <div className="feature-icon box-icon-style ">
                                <i className="lni lni-heart"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4>Renforcer la santé</h4>
                                <p className="text-justify">
                                    Favoriser le développement physique et mental des élèves en leur offrant un environnement sain, incluant une bonne nutrition, des soins de santé appropriés et un cadre propice à leur épanouissement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="a-propos" className="main-section" style={{ background: "#eff2f9" }}>
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 pr-4">
                        <div className="wow fadeInLeft">
                            <div className="p-1 shadow bg-white mb-5 rounded">
                                <Image width={1280} height={1280} style={{ objectFit: 'cover' }} className="w-100 h-100 rounded" src="/img/about/about-img.jpg" alt="About image" />
                            </div>

                            <div className="p-1 shadow bg-white mb-5 rounded">
                                <Image width={1280} height={1280} style={{ objectFit: 'cover' }} className="w-100 h-100 rounded" src="/img/about/about-2.jpg" alt="About image" />
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 pl-4">
                        <div className="about-content-wrapper">
                            <div className="section-title">
                                <span>À propos</span>
                                <h2 className="mb-2 wow fadeInRight">Le projet "cantine scolaire"</h2>
                                <p className="text-italic text-bold mb-4">Financé par <Link target="_blank" href="https://ambatovy.com/">Ambatovy SA</Link></p>
                            </div>
                            <div className="about-content">
                                <p className="text-justify text-gray-800 leading-relaxed mb-4">
                                    Le 12 septembre 2023, Ambatovy a signé une convention avec l'Office Régional de Nutrition pour la mise en place de cantine scolaire dans 10 écoles des districts de Toamasina I, Toamasina II et Brickaville, sur une période de 3 ans. Cette initiative bénéficiera à 2 500 élèves, répartis entre 8 Écoles Primaires Publiques (Vohitrambato, Ampihaonana, Soamahatsinjo, Tanandava, Amboakarivo, Ampasimadinika, Fanandrana, Tanambao) et 2 écoles maternelles (Tsaratsiry et Romialo).
                                </p>
                                <p className="text-justify text-gray-800 leading-relaxed mb-4">
                                    L'objectif principal est de renforcer la situation nutritionnelle des élèves afin d'améliorer leurs performances scolaire. Cette collaboration s'appuie sur un partenariat initié en 2018, avec des résultats encourageants : dans les EPP Vohitrambato, Ampihaonana et Soamahatsinjo, le taux de malnutrition chronique est passé de <strong>74 %</strong> en début d'année scolaire 2021-2022 à <strong>43 %</strong>.
                                </p>
                                <p className="text-justify text-gray-800 leading-relaxed">
                                    L'Office Régional de Nutrition est fier de contribuer à l'éducation et à la santé des enfants, en collaboration avec ses partenaires pour un avenir meilleur dans notre communauté.
                                </p>

                                <p className="font-italic">Source: <Link target="_blank" href={"https://ambatovy.com/en/fr/signature-dune-convention-avec-loffice-regional-de-nutrition/"}>Ambatovy le 12/09/2023</Link></p>

                                <div className="wow fadeInUp mt-40" data-wow-delay=".9s">
                                    <Link href="/activites" className="theme-btn py-2">Voir les activités</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="services" className="main-section">
            <div className="container">
                <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center mb-55">
                            <span>Apports du projet</span>
                            <h2>Les engagements du projet</h2>
                            <p>
                                Découvrez comment ce projet contribue à améliorer la nutrition et le bien-être des élèves, tout en renforçant leur performance scolaire.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {services.data.map((service, index) => <ServiceBlock key={index} title={service.title} icon={service.icon} link={`services/${service.id}`}>
                        {service.description}
                    </ServiceBlock>)}
                </div>
            </div>
        </section>

        <section id="partenaires" className="client-logo-section main-section">
            <div className="container">
                <div id="partenaireCarousel" className="test-section carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="carousel-wrapper">
                                <ClientLogo src="/img/client-logo/onn.png" alt="Office National de Nutrition" url="https://office-nutrition.mg/" />
                                <ClientLogo src="/img/client-logo/ambatovy.png" alt="Ambatovy" url="https://ambatovy.com/" />
                                <ClientLogo src="/img/client-logo/dren.png" alt="DREN" url="https://www.education.gov.mg/atsinanana/" />
                                <ClientLogo src="/img/client-logo/minae.png" alt="Agriculture et élevage" url="https://www.minae.gov.mg/" />
                                <ClientLogo src="/img/client-logo/drsp.jpeg" alt="DRSP" url="http://www.sante.gov.mg/ministere-sante-publique/" />
                                <ClientLogo src="/img/client-logo/nutri-zaza.png" alt="Nutri'ZAZA" url="https://nutrizaza.mg/" />
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#partenaireCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Precedent</span>
                    </a>
                    <a className="carousel-control-next" href="#partenaireCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Suivant</span>
                    </a>
                </div>
            </div>
        </section>

        <section id="contact" className="contact-section main-section" style={{ background: "#eff2f9" }}>
            <div className="container">
                <div className="row">
                    <div className="col-xl-4">
                        <div className="contact-item-wrapper">
                            <div className="row">
                                <div className="col-12 col-md-6 col-xl-12">
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <i className="lni lni-phone"></i>
                                        </div>
                                        <div className="contact-content">
                                            <h4>Contact</h4>
                                            <p>032 11 158 37</p>
                                            <p>ornatsinanana@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-xl-12">
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <i className="lni lni-map-marker"></i>
                                        </div>
                                        <div className="contact-content">
                                            <h4>Address</h4>
                                            <p>Villa Eglé, angle Boulevard Augagneur </p>
                                            <p>Toamasina I, Madagascar</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-xl-12">
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <i className="lni lni-facebook-original"></i>
                                        </div>
                                        <div className="contact-content">
                                            <h4>Facebook</h4>
                                            <p><Link target="_blank" href="https://www.facebook.com/profile.php?id=100064364605571">ORN Atsinanana</Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        <div className="contact-form-wrapper">
                            <div className="row">
                                <div className="row">
                                    <div className="col-xl-10 col-lg-8 mx-auto">
                                        <div className="section-title text-center mb-50">
                                            <span>Contactez-nous</span>
                                            <h2>Des suggestions ?</h2>
                                            <p>Remplir le formulaire ci-dessous</p>
                                        </div>
                                    </div>
                                </div>
                                <form action="/php/mail.php" className="contact-form">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input type="text" name="name" id="name" placeholder="Nom" required />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="email" name="email" id="email" placeholder="Email" required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input type="text" name="phone" id="phone" placeholder="Téléphone" required />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="text" name="subject" id="subject" placeholder="Objet" required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <textarea name="message" id="message" placeholder="Message" rows={5}></textarea>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="button text-center">
                                                <button type="submit" className="theme-btn">Envoyer le message</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}
