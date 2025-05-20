import Link from "next/link";
import Image from "next/image";

export default async function About() {
    return <section id="a-propos" className="main-section" style={{ background: "#eff2f9" }}>
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
}