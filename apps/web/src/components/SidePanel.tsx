import { ReactNode } from "react";
import { useAuthStore } from "hooks";
import { useLocation } from "react-router";
import logo from '@base/assets/images/logo.png';
import { AppTitle, DropDown, NavItem } from "@base/components";

export function SidePanel(): ReactNode {
    const { isAdmin, user } = useAuthStore()
    const { pathname } = useLocation()

    return <div id="app-sidepanel" className="app-sidepanel sidepanel-visible">
        <div id="sidepanel-drop" className="sidepanel-drop"></div>
        <div className="sidepanel-inner d-flex flex-column">
            <AppTitle appLogo={logo} appName="ORN ATSINANANA" />
            <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
                <ul className="app-menu list-unstyled accordion" id="menu-accordion">
                    <NavItem icon="speedometer" active={pathname === "/"} to="" label="Tableau de bord" />
                    <DropDown icon="bar-chart-fill" base="/anthropo-measure/statistics" label="Statistique" menus={[
                        { label: "Repartition des étudiants", to: "/student-repartition" },
                        { label: "Résultat par métrique", to: "/result-by-metric" },
                        { label: "Résultat global", to: "/result-global" }
                    ]} />

                    <GroupSeparator title="Mesure anthropométrique" />
                    <DropDown icon="people" base="/anthropo-measure/student" label="Étudiants" menus={[
                        { label: "Liste des étudiants", to: "/list" },
                        { label: "Ajouter un étudiant", to: "/add", can: isAdmin },
                        { label: "Importer une liste globale", to: "/import", can: (isAdmin && !user?.school) },
                        { label: "Mise a jour des classes", to: "/students-classes", can: isAdmin },
                        { label: "Importer une liste par classe", to: "/import-class", can: (isAdmin && !user?.school) }
                    ]} />
                    <DropDown base="/anthropo-measure/school" icon="houses" label="Ecoles" menus={[
                        { label: "Liste des écoles", to: "/list" },
                        { label: "Ajouter un nouveau école", to: "/add", can: (isAdmin && !user?.school) },
                        { label: "Les classes", to: "/classes/list", can: isAdmin },
                        { label: "Les niveaux", to: "/levels/list", can: isAdmin }
                    ]} />
                    {(isAdmin && !user?.school) && <DropDown label="Abaques" base="/anthropo-measure/abaques" icon="database"
                        menus={[
                            { to: '/add', label: 'Ajouter', can: isAdmin },
                            { to: '/list', label: 'Liste' },
                            { to: '/import', label: 'Importer une liste', can: isAdmin }
                        ]}
                    />}
                    <DropDown icon="rulers" base="/anthropo-measure/survey" label="Mesures" menus={[
                        { to: '/add', label: 'Nouvelle mesure', can: (isAdmin && !user?.school) },
                        { to: '/list', label: 'Liste des mesures' },
                        { to: '/add-student', label: 'Mesurer des étudiants', can: isAdmin }
                    ]} />

                    <GroupSeparator title="Cantine scolaire" />
                    <DropDown label="Collations" base="/cantine/foods" icon="cookie" menus={[
                        { to: '/add', label: 'Ajouter', can: (isAdmin && !user?.school) },
                        { to: '/list', label: 'Liste des collations' }
                    ]}/>
                    <DropDown label="Consommations" base="/cantine/consommation" icon="basket3" menus={[
                        { to: '/add', label: 'Ajouter', can: isAdmin },
                        { to: '/list', label: 'Historiques' },
                        { to: '/import', label: 'Importer', can: (isAdmin && !user?.school) },
                        { to: '/statistics', label: 'Récapitulatifs', can: isAdmin }
                    ]}/>
                    <DropDown label="Gestion de stocks" base="/cantine/stocks" icon="file" menus={[
                        { to: '/in', label: 'Entree', can: isAdmin },
                        { to: '/out', label: 'Stortie' },
                        { to: '/recap', label: 'Fiche de stock' },
                    ]}/>

                    <GroupSeparator title="Activités" />
                    <NavItem icon="activity" active={pathname === "/activities" || pathname.includes("/activities/show")} to="/activities" label="Les dernières activités" />
                    <DropDown label="Gestion des activités" base="/activities/admin" icon="gear" menus={[
                        { to: '/add', label: 'Ajouter un activité', can: isAdmin },
                        { to: '/list', label: 'Liste des activités' }
                    ]}/>

                    <GroupSeparator title="Gestion des prix" />
                    <DropDown label="Articles" base="/prices/articles" icon="list" menus={[
                        { to: '/add', label: 'Ajouter un article', can: isAdmin },
                        { to: '/list', label: 'Liste des articles'}
                    ]} />

                    <DropDown label="Unités" base="/prices/units" icon="123" menus={[
                        { to: '/add', label: 'Nouveau unité', can: isAdmin },
                        { to: '/list', label: 'Liste des unités' }
                    ]}/>

                    <DropDown label="Gestion des prix" base="/prices/manage" icon="cash" menus={[
                        { to: '/add', label: "Renseigner un prix d'articles", can: isAdmin },
                        { to: '/list', label: "Liste des prix d'articles" }
                    ]}/>

                    <DropDown label="Sites" base="/prices/sites" icon="houses" menus={[
                        { to: '/add', label: 'Ajouter un site', can: isAdmin },
                        { to: '/list', label: 'Liste des sites' }
                    ]}/>

                    {/*
                        <GroupSeparator title="Jardin scolaire" />
                        <NavItem icon="box" to="/scholar-garden/engrais" label="Engrais" />
                        <NavItem icon="flower1" to="/scholar-garden/semences" label="Sémences" />
                        <NavItem icon="tools" to="/scholar-garden/semences" label="Matériels" />
                        <DropDown label="Gérer les jardins" base="/scholar-garden" icon="gear" menus={[
                            { to: '/add', label: 'Nouveau jardin' },
                            { to: '/list', label: 'Liste des jardins' },
                            { to: '/steps', label: 'Etapes' },
                            { to: '/steps-data', label: 'Ajouter des données' }
                        ]}/>
                    */}

                    <GroupSeparator title="Divers" />
                    <NavItem icon="file-earmark-text-fill" active={pathname.includes("/documents")} to="/documents" label="Documents" />
                    <DropDown label="Outils" base="/tools" icon="tools" menus={[
                        { to: '/z-calculator', label: 'Calculateur de Z' },
                        { to: '/value-repartition', label: 'Repartisseur de valeur' },
                    ]} />
                </ul>
            </nav>

            <div className="app-sidepanel-footer">
                <nav className="app-nav app-nav-footer">
                    <ul className="app-menu footer-menu list-unstyled">
                        <DropDown label="Paramètres" base="/settings" icon="gear" menus={[
                            { to: '/jardin', label: 'Jardin scolaire', can: isAdmin },
                            { to: '/services', label: 'Services', can: isAdmin },
                        ]}/>

                        <NavItem to="/about" active={pathname === "/about"} icon="info-circle" label="A propos" />
                        <NavItem to="/contributors" active={pathname === "/contributors"} icon="people" label="Contributeurs" />
                    </ul>
                </nav>
            </div>
        </div>
    </div>
}

function GroupSeparator({ title }: { title: ReactNode }): ReactNode {
    return <div className="nav-link-separator">
        <span>{title}</span>
        <hr />
    </div>
}