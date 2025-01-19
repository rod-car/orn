import { Activity } from "@/app/components/Activity"
import Link from "next/link"
import ClientLogo from "@/app/components/ClientLogo"

export const dynamic = 'force-dynamic'

export default async function Home() {
    let activities: {
        data: {
            images: {
                path: string
            }[],
            id: number
            title: string
            date: string
            details: string
        }[]
    } = { data: [] }
    try {
        const data = await fetch('https://api.orn-atsinanana.mg/api/activities?imagesCount=4&take=4')
        activities = await data.json()
        console.log("Connected to server")
    } catch (e) {
        console.log("Impossible de contacter le serveur")
        console.error((e as any).toString())
    }

    return <>
        <section id="accueil" className="carousel-section-wrapper">
            <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-section carousel-item active clip-bg pt-225 pb-200 img-bg"
                        style={{ backgroundImage: "url('/img/carousel/1.jpg')", backgroundPosition: "center" }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-8 col-lg-10 mx-auto">
                                    <div className="carousel-content text-center">
                                        <div className="section-title">
                                            <h2 className="text-white">Office Regional de Nutrition Atsinanana</h2>
                                            <p className="text-white">La nutrition, garant du développement social et économique pour Madagascar.</p>
                                        </div>
                                        <a href="javascript:void(0)" className="theme-btn border-btn">Voir plus</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-section carousel-item clip-bg pt-225 pb-200 img-bg" style={{ backgroundImage: "url('/img/carousel/2.jpg')" }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-8 col-lg-10 mx-auto">
                                    <div className="carousel-content text-center">
                                        <div className="section-title">
                                            <h2 className="text-white">Office Regional de Nutrition Atsinanana</h2>
                                            <p className="text-white">L'approche systémique pour la nutrition est un moyen de renforcer les relations, et donc la coordination, entre les différents secteurs qui ont un impact sur la nutrition.</p>
                                        </div>
                                        <a href="javascript:void(0)" className="theme-btn border-btn">Voir plus</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

        <section id="missions" className="main-section">
            <div className="container">
                <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center mb-55">
                            <span className="wow fadeInDown" data-wow-delay=".2s">Notre Mission</span>
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">Notre rôle dans la région</h2>
                            <p className="wow fadeInUp" data-wow-delay=".6s">
                                En tant qu'entité gouvernementale, nous sommes dédiée à la lutte contre la malnutrition
                                et à la promotion de la sécurité alimentaire dans la région. Nous collaborons avec les autorités locales, les communautés et les partenaires pour un impact durable.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6 wow fadeInLeft" data-wow-delay=".2s">
                        <div className="feature-box h-100 mb-0 box-style">
                            <div className="feature-icon box-icon-style wow fadeInDown" data-wow-delay=".2s">
                                <i className="lni lni-map-marker"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4 className="wow fadeInDown" data-wow-delay=".2s">Action locale</h4>
                                <p className="wow fadeInDown" data-wow-delay=".3s">Nous travaillons en étroite collaboration avec les communes et les communautés locales pour répondre efficacement aux besoins nutritionnels spécifiques de la région d'Atsinanana.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 wow fadeInDown" data-wow-delay=".2s">
                        <div className="feature-box h-100 mb-0 box-style">
                            <div className="feature-icon box-icon-style wow fadeInDown" data-wow-delay=".2s">
                                <i className="lni lni-users"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4 className="wow fadeInDown" data-wow-delay=".2s">Renforcement des capacités</h4>
                                <p className="wow fadeInDown" data-wow-delay=".3s">Nous formons et accompagnons les acteurs locaux, notamment dans la mise en œuvre de programmes éducatifs et de sensibilisation nutritionnelle.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 wow fadeInRight" data-wow-delay=".2s">
                        <div className="feature-box h-100 mb-0 box-style">
                            <div className="feature-icon box-icon-style wow fadeInDown" data-wow-delay=".2s">
                                <i className="lni lni-stats-up"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4 className="wow fadeInDown" data-wow-delay=".2s">Suivi et évaluation</h4>
                                <p className="wow fadeInDown" data-wow-delay=".3s">Nous assurons le suivi des indicateurs nutritionnels régionaux pour mesurer l'impact de nos actions et adapter nos interventions selon les besoins.</p>
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
                        <div className="wow fadeInLeft" data-wow-delay=".3s">
                            <img className="w-100 mb-5 shadow" src="/img/about/about-img.jpg" alt="About image" />
                            <img className="w-100 shadow" src="/img/about/about-img-2.png" alt="About image" />
                        </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 pl-4">
                        <div className="about-content-wrapper">
                            <div className="section-title">
                                <span className="wow fadeInUp" data-wow-delay=".2s">À propos de nous</span>
                                <h2 className="mb-40 wow fadeInRight" data-wow-delay=".4s">Un pilier pour la nutrition à Atsinanana</h2>
                            </div>
                            <div className="about-content">
                                <p className="mb-45 wow fadeInUp" data-wow-delay=".6s">
                                    L'Office Régional de Nutrition d'Atsinanana (ORN) est une institution publique engagée dans la lutte contre la malnutrition
                                    et l'amélioration de la santé des communautés locales. Nos initiatives couvrent plusieurs domaines clés :
                                    éducation nutritionnelle, sécurité alimentaire, soutien aux enfants vulnérables et suivi des indicateurs nutritionnels.
                                </p>
                                <ul className="wow fadeInUp" data-wow-delay=".7s">
                                    <li>✅ Collaboration avec 50+ communes rurales et urbaines.</li>
                                    <li>✅ Formation de plus de 200 agents communautaires en pratiques nutritionnelles.</li>
                                    <li>✅ Sensibilisation de 30,000+ familles à travers des campagnes locales.</li>
                                    <li>✅ Distribution de repas enrichis (Koba Aina, PObary) dans 10 écoles maternelles et primaires.</li>
                                </ul>

                                <div className="mt-5 counter-up wow fadeInUp" data-wow-delay=".8s">
                                    <div className="counter">
                                        <span id="client-count" className="countup count color-1" cup-end="50" cup-append="+">50</span>
                                        <h4>Communes partenaires</h4>
                                        <p>Collaboration directe avec les acteurs locaux pour des solutions adaptées aux besoins spécifiques.</p>
                                    </div>
                                    <div className="counter">
                                        <span id="project-count" className="countup count color-2" cup-end="120" cup-append="+">120</span>
                                        <h4>Projets réalisés</h4>
                                        <p>Programmes de prévention, distribution alimentaire et suivi des enfants.</p>
                                    </div>
                                    <div className="counter">
                                        <span id="impact-count" className="countup count color-3" cup-end="30000" cup-append="+">30,000</span>
                                        <h4>Bénéficiaires directs</h4>
                                        <p>Familles, enfants et femmes enceintes sensibilisés ou accompagnés.</p>
                                    </div>
                                </div>
                                <div className="wow fadeInUp mt-40" data-wow-delay=".9s">
                                    <Link href="/projets" className="btn btn-outline-primary">Voir nos projets</Link>
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
                            <span className="wow fadeInDown" data-wow-delay=".2s">Nos aports</span>
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">Engagés pour un avenir meilleur</h2>
                            <p className="wow fadeInUp" data-wow-delay=".6s">
                                Découvrez comment nous contribuons à améliorer la nutrition et le bien-être des communautés de la région d'Atsinanana.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="service-box h-100 box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-dinner"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Distribution Alimentaire</h4>
                                <p>
                                    Mise en place de programmes d'alimentation scolaire avec des repas enrichis tels que Koba Aina et PObary
                                    pour lutter contre la malnutrition infantile.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="service-box h-100 box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-graduation"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Éducation Nutritionnelle</h4>
                                <p>
                                    Sensibilisation et formation des communautés sur les pratiques alimentaires saines
                                    pour prévenir la malnutrition et promouvoir une meilleure santé.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="service-box h-100 box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-stats-up"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Suivi des Indicateurs</h4>
                                <p>
                                    Collecte et analyse des données nutritionnelles pour évaluer les progrès réalisés et
                                    identifier les zones nécessitant une intervention prioritaire.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <div className="service-box h-100 box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-support"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Soutien aux Femmes et Enfants</h4>
                                <p>
                                    Programmes spécifiques pour les femmes enceintes et allaitantes ainsi que pour les enfants de moins de 5 ans,
                                    afin de garantir un bon départ dans la vie.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="service-box h-100 box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-handshake"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Partenariats Locaux</h4>
                                <p>
                                    Collaboration avec les autorités locales, ONG et autres acteurs pour renforcer l’impact
                                    des initiatives en nutrition dans la région.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="service-box h-100 box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-heart"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Assistance en Cas d'Urgence</h4>
                                <p>
                                    Réponse rapide en cas de crises alimentaires ou de catastrophes naturelles pour
                                    assurer la sécurité alimentaire des populations vulnérables.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="activites" className="main-section" style={{ background: "#eff2f9" }}>
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center mb-55">
                            <span className="wow fadeInDown" data-wow-delay=".2s">Activités</span>
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">Nos Récentes Activités</h2>
                            <p className="wow fadeInUp" data-wow-delay=".6s">
                                Découvrez les initiatives clés récemment mises en œuvre pour promouvoir le bien-être et la nutrition dans la région.
                            </p>
                            <Link href="/activites" className="btn btn-primary">Voir tous les activites</Link>
                        </div>
                    </div>
                </div>

                {activities.data.length === 0 && <p className="text-center">Aucune donnees</p>}

                {activities.data.map((activity, index: number) => <Activity key={activity.id} index={index} activity={activity} />)}
            </div>
        </section>

        <section id="partenaries" className="client-logo-section main-section">
            <div className="container">
                <div id="partenaireCarousel" className="test-section carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="carousel-wrapper">
                                <ClientLogo src="/img/client-logo/onn.png" alt="Office National de Nutrition" />
                                <ClientLogo src="/img/client-logo/ambatovy.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/agrivet.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/dren.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/drsp.jpeg" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/fid.jpeg" alt="Ambatovy" />
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="carousel-wrapper">
                                <ClientLogo src="/img/client-logo/gret.jpeg" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/hina.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/instat.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/mcc.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/minae.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/mm.png" alt="Ambatovy" />
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="carousel-wrapper">
                                <ClientLogo src="/img/client-logo/nutri-zaza.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/refrigepeche.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/saf-fjkm.png" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/st-gabriel.jpg" alt="Ambatovy" />
                                <ClientLogo src="/img/client-logo/tilapia-est.jpeg" alt="Ambatovy" />
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
                                            <i className="lni lni-alarm-clock"></i>
                                        </div>
                                        <div className="contact-content">
                                            <h4>Facebook</h4>
                                            <p>ORN Atsinanana</p>
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
                                            <span className="wow fadeInDown" data-wow-delay=".2s">Contactez-nous</span>
                                            <h2 className="wow fadeInUp" data-wow-delay=".4s">Prêt à commencer</h2>
                                            <p className="wow fadeInUp" data-wow-delay=".6s">At vero eos et accusamus et iusto odio dignissimos ducimus quiblanditiis praesentium</p>
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
                                            <input type="text" name="phone" id="phone" placeholder="Telephone" required />
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
