import { ReactNode } from "react";
import { Users, Target, Utensils, BarChart3, Shield, Heart, Code, Database, Block, PageTitle } from "ui";

export function About(): ReactNode {
    const objectives = [
        {
            icon: <Utensils className="bi bi-utensils fs-3" />,
            title: "Optimiser la planification des repas",
            description: "Éviter le gaspillage alimentaire grâce à une planification intelligente"
        },
        {
            icon: <Users className="bi bi-people fs-3" />,
            title: "Améliorer la communication",
            description: "Faciliter les échanges entre écoles, parents et fournisseurs"
        },
        {
            icon: <Heart className="bi bi-heart fs-3" />,
            title: "Garantir une alimentation saine",
            description: "Assurer une nutrition équilibrée pour tous les élèves"
        },
        {
            icon: <BarChart3 className="bi bi-bar-chart fs-3" />,
            title: "Faciliter l'analyse des données",
            description: "Optimiser le pilotage des cantines avec des données précises"
        }
    ];

    const features = [
        "Gestion des inscriptions et des préférences alimentaires des élèves",
        "Suivi quotidien des repas servis et des présences",
        "Tableaux de bord personnalisés pour les gestionnaires et les écoles",
        "Alertes et notifications pour les changements et événements importants",
        "Export des données pour analyses et rapports"
    ];

    const values = [
        { icon: <Shield className="bi bi-shield-lock fs-5 me-2" />, text: "Transparence" },
        { icon: <Target className="bi bi-bullseye fs-5 me-2" />, text: "Efficacité" },
        { icon: <Heart className="bi bi-heart-fill fs-5 me-2" />, text: "Responsabilité environnementale" },
        { icon: <Users className="bi bi-people-fill fs-5 me-2" />, text: "Engagement pour la santé des enfants" }
    ];

    const technologies = [
        { icon: <Code className="bi bi-code fs-5 mb-2" />, name: "React", description: "Interface utilisateur moderne" },
        { icon: <Database className="bi bi-database fs-5 mb-2" />, name: "PHP/Laravel", description: "API backend robuste" },
        { icon: <Shield className="bi bi-shield-lock fs-5 mb-2" />, name: "Base de données sécurisée", description: "Confidentialité garantie" }
    ];

    return <>
        <PageTitle title="À propos" />
        <Block className="mb-3">
            <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style={{ width: 80, height: 80, background: "linear-gradient(90deg, #3b82f6, #10b981)" }}>
                    <Utensils className="text-white fs-2" />
                </div>
                <h2 className="fw-semibold text-secondary mb-3">Plateforme Cantine Scolaire</h2>
            </div>
            <p className="lead text-center mx-auto" style={{ maxWidth: 640 }}>
                Bienvenue sur la plateforme <span className="fw-semibold text-primary">Cantine Scolaire</span>,
                un système innovant conçu pour faciliter la gestion et le suivi des données liées à la restauration scolaire.
                Notre solution vise à offrir une visibilité claire et en temps réel sur les repas servis, les inscriptions des élèves,
                ainsi que les préférences alimentaires.
            </p>
        </Block>

        <Block className="mb-3">
            <h3 className="text-center fw-semibold mb-4">Objectifs principaux</h3>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {objectives.map((objective, index) => (
                    <div key={index} className="col">
                        <div className="d-flex align-items-start p-3 rounded border border-primary bg-light">
                            <div className="d-flex align-items-center justify-content-center bg-white rounded shadow-sm me-3" style={{ width: 48, height: 48 }}>
                                {objective.icon}
                            </div>
                            <div>
                                <h4 className="fw-semibold mb-1">{objective.title}</h4>
                                <p className="mb-0 text-muted">{objective.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Block>

        <Block className="mb-3">
            <h3 className="text-center fw-semibold mb-4">Fonctionnalités clés</h3>
            <div className="row row-cols-1 row-cols-lg-2 g-3">
                {features.map((feature, index) => (
                    <div key={index} className="col">
                        <div className="d-flex align-items-center bg-light rounded p-3">
                            <div className="rounded-circle" style={{ width: 8, height: 8, background: "linear-gradient(90deg, #3b82f6, #10b981)" }}></div>
                            <p className="mb-0 ms-3 text-secondary">{feature}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Block>

        <Block className="mb-3">
            <h3 className="text-center fw-semibold mb-4">Nos valeurs</h3>
            <div className="d-flex flex-wrap justify-content-center gap-3">
                {values.map((value, index) => (
                    <div key={index} className="d-flex align-items-center bg-primary bg-opacity-10 rounded-pill px-4 py-2 border border-primary">
                        {value.icon}
                        <span className="fw-medium text-secondary">{value.text}</span>
                    </div>
                ))}
            </div>
        </Block>

        <Block className="mb-3">
            <h3 className="text-center fw-semibold mb-4">Notre équipe</h3>
            <p className="text-secondary text-center mx-auto" style={{ maxWidth: 640, lineHeight: 1.6 }}>
                Ce projet est le fruit d'une collaboration étroite entre des <span className="fw-semibold text-primary">développeurs passionnés</span>,
                des <span className="fw-semibold text-success">responsables de cantines scolaires</span> et des
                <span className="fw-semibold text-purple"> experts en nutrition</span>.
                Ensemble, nous travaillons pour apporter une solution simple, fiable et accessible à tous.
            </p>
        </Block>

        <Block className="mb-3">
            <h3 className="text-center fw-semibold mb-4">Technologies utilisées</h3>
            <div className="row row-cols-1 row-cols-md-3 g-4 text-center">
                {technologies.map((tech, index) => (
                    <div key={index} className="col">
                        <div className="bg-light rounded border border-secondary p-4 shadow-sm">
                            <div className="mb-3 text-primary fs-3">
                                {tech.icon}
                            </div>
                            <h4 className="fw-semibold mb-2">{tech.name}</h4>
                            <p className="text-muted small">{tech.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Block>

        <Block className="text-center py-4">
            <div className="d-inline-flex align-items-center gap-2 text-muted">
                <div className="rounded-circle" style={{ width: 12, height: 12, background: "linear-gradient(90deg, #3b82f6, #10b981)" }}></div>
                <span>Ensemble pour une restauration scolaire moderne et durable</span>
                <div className="rounded-circle" style={{ width: 12, height: 12, background: "linear-gradient(90deg, #3b82f6, #10b981)" }}></div>
            </div>
        </Block>
    </>
}
