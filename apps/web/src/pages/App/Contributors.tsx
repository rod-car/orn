import { ReactNode } from "react";
import { Code, Users, Award, Heart, PageTitle, Block } from "ui";

interface ContributorInfoProps {
    names: string[];
    role: string;
    icon: ReactNode;
    description: string;
    color: string; // couleurs pour le dégradé inline
}

function ContributorInfo({
    names,
    role,
    icon,
    description,
    color,
}: ContributorInfoProps) {
    const avatarColors = [
        "bg-primary",
        "bg-success",
        "bg-warning",
        "bg-danger",
        "bg-info",
        "bg-secondary",
        "bg-dark",
        "bg-muted",
    ];
    const getAvatarColor = (name: string) => {
        const index = name.length % avatarColors.length;
        return avatarColors[index];
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="mb-4">
            <div
                className="d-flex align-items-center p-3 rounded text-white mb-4"
                style={{
                    background: `linear-gradient(90deg, ${color.split(" ")[0]}, ${color.split(" ")[1]
                        })`,
                }}
            >
                <div className="bg-white rounded shadow d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                    <div className="text-dark fs-4">{icon}</div>
                </div>
                <div>
                    <h3 className="fw-bold text-white">{role}</h3>
                    <p className="mb-0 opacity-75">{description}</p>
                </div>
            </div>

            <div className="row px-3">
                {names.map((name) => (
                    <div
                        key={name}
                        className="col-12 col-md-6 col-lg-4 border rounded bg-light p-3 shadow-sm mb-3"
                        role="listitem"
                    >
                        <div className="d-flex align-items-center mb-3">
                            <div
                                className={`${getAvatarColor(
                                    name
                                )} rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3`}
                                style={{ width: 56, height: 56, fontSize: "1.25rem" }}
                            >
                                {getInitials(name)}
                            </div>
                            <div>
                                <h5 className="mb-0">{name}</h5>
                                <small className="text-muted">{role}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Contributors(): ReactNode {
    const contributorGroups = [
        {
            names: ["Gislain Carino Rodrigue BOUDI"],
            role: "Développeur Principal",
            icon: <Code className="fs-4" />,
            description: "Architecture technique et développement de la plateforme",
            color: "#3b82f6 #2563eb", // bleu clair -> bleu foncé (pour dégradé inline)
        },
        {
            names: ["Prisca", "Franco", "Toky"],
            role: "Agents de Saisie",
            icon: <Users className="fs-4" />,
            description: "Gestion des données et saisie des informations",
            color: "#10b981 #047857", // vert clair -> vert foncé
        },
    ];

    const stats = [
        { number: "4", label: "Contributeurs actifs", icon: <Users className="fs-5" /> },
        { number: "2", label: "Équipes spécialisées", icon: <Award className="fs-5" /> },
        { number: "100%", label: "Engagement", icon: <Heart className="fs-5" /> },
    ];

    return (
        <div className="container">
            <PageTitle title="Contributeurs" />

            <Block className="mb-3 px-3">
                <div className="text-center mb-5">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                        style={{ width: 80, height: 80, background: "linear-gradient(90deg, #3b82f6, #10b981)" }}
                    >
                        <Users className="text-white fs-2" />
                    </div>
                    <h2 className="fw-semibold text-secondary mb-3">Notre Équipe Dédiée</h2>
                    <p className="lead text-secondary mx-auto" style={{ maxWidth: 640 }}>
                        Voici la liste des personnes qui ont contribué au développement et à la gestion de la plateforme
                        <span className="fw-bold text-primary"> Cantine Scolaire</span>.
                        Leur engagement et leur expertise ont été essentiels à la réussite de ce projet.
                    </p>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="text-center p-4 rounded shadow-sm border bg-white"
                            role="region"
                            aria-label={stat.label}
                        >
                            <div className="d-inline-flex align-items-center justify-content-center bg-white rounded shadow-sm mb-3" style={{ width: 48, height: 48 }}>
                                <div className="text-primary fs-4">{stat.icon}</div>
                            </div>
                            <div className="fs-2 fw-bold text-dark mb-1">{stat.number}</div>
                            <div className="text-secondary">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </Block>

            <Block className="mb-3 px-3">
                {contributorGroups.map((group, index) => (
                    <ContributorInfo key={index} {...group} />
                ))}
            </Block>

            <Block className="mb-3 px-3">
                <div
                    className="text-center p-5 rounded border border-primary bg-white shadow-sm"
                    style={{ background: "linear-gradient(90deg, #e0f2fe, #d1fae5)" }}
                >
                    <Heart className="fs-1 text-danger mx-auto mb-3" />
                    <h3 className="fw-semibold text-dark mb-3">Nos Remerciements</h3>
                    <p className="text-secondary mx-auto" style={{ maxWidth: 600, lineHeight: 1.6 }}>
                        Nous tenons à remercier chaleureusement tous les contributeurs qui ont donné de leur temps
                        et de leur expertise pour faire de cette plateforme une réalité. Votre dévouement fait la différence
                        dans la vie quotidienne des écoles et des familles.
                    </p>
                </div>
            </Block>
        </div>
    );
}
