import { ReactNode } from "react";
import { useLocation } from "react-router";
import logo from '@base/assets/images/logo.png';
import { AppTitle, DropDown, NavItem } from "@base/components";
import { useAuthStore } from "hooks";

export function SidePanel(): ReactNode {
    const { pathname } = useLocation()

    return <div id="app-sidepanel" className="app-sidepanel sidepanel-visible">
        <div id="sidepanel-drop" className="sidepanel-drop"></div>
        <div className="sidepanel-inner d-flex flex-column">
            <AppTitle appLogo={logo} appName="ORN ATSINANANA" />
            <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
                <ul className="app-menu list-unstyled accordion" id="menu-accordion">
                    <NavItem icon="speedometer" active={pathname === "/"} to="/" permission="dashboard.view" label="Tableau de bord" />
                    <DropDown icon="bar-chart-fill" base="/anthropo-measure/statistics" label="Statistique" permission="statistics.view" menus={[
                        { label: "Repartition des étudiants", to: "/student-repartition", permission: "statistics.view" },
                        { label: "Résultat par métrique", to: "/result-by-metric", permission: "statistics.view" },
                        { label: "Résultat global", to: "/result-global", permission: "statistics.view" }
                    ]} />
                    <GroupSeparator permission={["student.view", "school.view", "abaque.view", "anthropometry.view"]} title="Mesure anthropométrique" />
                    <DropDown icon="people" base="/anthropo-measure/student" label="Étudiants" permission="student.view" menus={[
                        { label: "Liste des étudiants", to: "/list", permission: "student.view" },
                        { label: "Ajouter un étudiant", to: "/add", permission: "student.create" },
                        { label: "Importer une liste globale", to: "/import", permission: "student.import" },
                        { label: "Mise a jour des classes", to: "/students-classes", permission: "student.update-class" },
                        { label: "Importer une liste par classe", to: "/import-class", permission: "student.import-class" }
                    ]} />
                    <DropDown base="/anthropo-measure/school" icon="houses" label="Ecoles" permission="school.view" menus={[
                        { label: "Liste des écoles", to: "/list", permission: "school.view" },
                        { label: "Ajouter un nouveau école", to: "/add", permission: "school.create" },
                        { label: "Les classes", to: "/classes/list", permission: "class.view" },
                        { label: "Les niveaux", to: "/levels/list", permission: "level.view" }
                    ]} />
                    <DropDown label="Abaques" base="/anthropo-measure/abaques" icon="database" permission="abaque.view" menus={[
                        { to: '/add', label: 'Ajouter', permission: "abaque.create" },
                        { to: '/list', label: 'Liste', permission: "abaque.view" },
                        { to: '/import', label: 'Importer une liste', permission: "abaque.import" }
                    ]} />
                    <DropDown icon="rulers" base="/anthropo-measure/survey" label="Mesures" permission="anthropometry.view" menus={[
                        { to: '/add', label: 'Nouvelle mesure', permission: "anthropometry.create" },
                        { to: '/list', label: 'Liste des mesures', permission: "anthropometry.view" },
                        { to: '/add-student', label: 'Mesurer des étudiants', permission: "anthropometry.form" }
                    ]} />

                    <GroupSeparator permission={["food.view", "consommation.view", "stock.view"]} title="Cantine scolaire" />
                    <DropDown label="Collations" base="/cantine/foods" icon="cookie" permission="food.view" menus={[
                        { to: '/add', label: 'Ajouter', permission: "food.create" },
                        { to: '/list', label: 'Liste des collations', permission: "food.view" }
                    ]}/>
                    <DropDown label="Consommations" base="/cantine/consommation" icon="basket3" permission="consommation.view" menus={[
                        { to: '/add', label: 'Ajouter', permission: "consommation.create" },
                        { to: '/list', label: 'Historiques', permission: "consommation.view" },
                        { to: '/import', label: 'Importer', permission: "consommation.import" },
                        { to: '/statistics', label: 'Récapitulatifs', permission: "consommation.statistics" }
                    ]}/>
                    <DropDown label="Gestion de stocks" base="/cantine/stocks" icon="file" permission="stock.view" menus={[
                        { to: '/in', label: 'Entree', permission: "stock.in" },
                        { to: '/out', label: 'Stortie', permission: "stock.out" },
                        { to: '/recap', label: 'Fiche de stock', permission: "stock.recap" },
                    ]}/>

                    <GroupSeparator permission={["activity.view"]} title="Activités" />
                    <NavItem icon="activity" active={pathname === "/activities" || pathname.includes("/activities/show")} to="/activities" permission="activity.view" label="Les dernières activités" />
                    <NavItem icon="activity" active={pathname === "/activities/list" || pathname.includes("/activities/list")} to="/activities/list" permission="activity.view" label="Tous les activités" />
                    <DropDown label="Gestion des activités" base="/activities/admin" icon="gear" permission="activity.view" menus={[
                        { to: '/add', label: 'Ajouter un activité', permission: "activity.create" },
                        { to: '/list', label: 'Liste des activités', permission: "activity.view" }
                    ]}/>

                    <GroupSeparator title="Gestion des prix" permission={["article.view", "unit.view", "price.view"]} />
                    <DropDown label="Articles" base="/prices/articles" icon="list" permission="article.view" menus={[
                        { to: '/add', label: 'Ajouter un article', permission: "article.create" },
                        { to: '/list', label: 'Liste des articles', permission: "article.view" }
                    ]} />
                    <DropDown label="Unités" base="/prices/units" icon="123" permission="unit.view" menus={[
                        { to: '/add', label: 'Nouveau unité', permission: "unit.create" },
                        { to: '/list', label: 'Liste des unités', permission: "unit.view" }
                    ]}/>
                    <DropDown label="Gestion des prix" base="/prices/manage" icon="cash" permission="price.view" menus={[
                        { to: '/add', label: "Renseigner un prix d'articles", permission: "price.create" },
                        { to: '/list', label: "Liste des prix d'articles", permission: "price.view" },
                        { to: '/recap', label: "Recapitulatif", permission: "price.recap" }
                    ]}/>
                    <DropDown label="Sites" base="/prices/sites" icon="houses" permission="site.view" menus={[
                        { to: '/add', label: 'Ajouter un site', permission: "site.create" },
                        { to: '/list', label: 'Liste des sites', permission: "site.view" }
                    ]}/>

                    <GroupSeparator permission={["document.view", "tools.z-calculator", "tools.value-repartition"]} title="Divers" />
                    <NavItem icon="file-earmark-text-fill" active={pathname.includes("/documents")} to="/documents" permission="document.view" label="Documents" />
                    <DropDown label="Outils" base="/tools" icon="tools" permission={["tools.z-calculator", "tools.value-repartition"]} menus={[
                        { to: '/z-calculator', label: 'Calculateur de Z', permission: "tools.z-calculator" },
                        { to: '/value-repartition', label: 'Repartisseur de valeur', permission: "tools.value-repartition" },
                    ]} />

                </ul>
            </nav>

            <div className="app-sidepanel-footer">
                <nav className="app-nav app-nav-footer">
                    <ul className="app-menu footer-menu list-unstyled">
                        <DropDown label="Gestion des utilisateurs" base="/user" icon="people" permission={["user.view", "role.view", "permission.view"]} menus={[
                            { to: '/list', label: 'Utilisateurs', permission: "user.view" },
                            { to: '/role', label: 'Roles', permission: "role.view" },
                            { to: '/permission', label: 'Permissions', permission: "permission.view" },
                        ]}/>
                        <DropDown label="Paramètres" base="/settings" icon="gear" permission="settings.view" menus={[
                            { to: '/jardin', label: 'Jardin scolaire', permission: "jardin.view" },
                            { to: '/services', label: 'Services', permission: "service.view" },
                        ]}/>

                        <NavItem permission="app.about" to="/about" active={pathname === "/about"} icon="info-circle" label="A propos" />
                        <NavItem permission="app.contributors" to="/contributors" active={pathname === "/contributors"} icon="people" label="Contributeurs" />
                    </ul>
                </nav>
            </div>
        </div>
    </div>
}

function GroupSeparator({ title, permission = [] }: { title: ReactNode, permission: string|string[] }): ReactNode {
    const { isAllowed } = useAuthStore();

    if (!isAllowed(permission)) return undefined;

    return <div className="nav-link-separator">
        <span>{title}</span>
        <hr />
    </div>
}