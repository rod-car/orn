import { ReactNode } from "react";
import { useAuthStore } from "hooks";
import logo from '@base/assets/images/logo.png';
import { AppTitle, DropDown, NavItem } from "@base/components";
import { useLocation } from "react-router";

export function SidePanel(): ReactNode {
    const { isAdmin } = useAuthStore()
    const { pathname } = useLocation()

    return <div id="app-sidepanel" className="app-sidepanel">
        <div id="sidepanel-drop" className="sidepanel-drop"></div>
        <div className="sidepanel-inner d-flex flex-column">
            <AppTitle appLogo={logo} appName="PLATEFORME ORN" />
            <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
                <ul className="app-menu list-unstyled accordion" id="menu-accordion">
                    <NavItem icon="dashboard" active={pathname === "/"} to="/" label="Tableau de bord" />

                    <GroupSeparator title="Mesure anthropométrique" />
                    <DropDown icon="users" base="/anthropo-measure/student" label="Etudiants" menus={[
                        { label: "Liste des étudiants", to: "/list" },
                        { label: "Ajouter un étudiant", to: "/add", can: isAdmin },
                        { label: "Importer une liste", to: "/import", can: isAdmin },
                        { label: "Mise a jour des classes", to: "/students-classes", can: isAdmin }
                    ]} />
                    <DropDown base="/anthropo-measure/school" icon="school" label="Ecoles" menus={[
                        { label: "Liste des écoles", to: "/list" },
                        { label: "Ajouter un nouveau école", to: "/add", can: isAdmin },
                        { label: "Les classes", to: "/classes/list", can: isAdmin },
                        { label: "Les niveaux", to: "/levels/list", can: isAdmin }
                    ]} />
                    {isAdmin && <DropDown label="Abaques" base="/anthropo-measure/abaques" icon="database"
                        menus={[
                            { to: '/add', label: 'Ajouter', can: isAdmin },
                            { to: '/list', label: 'Liste' },
                            { to: '/import', label: 'Importer une liste', can: isAdmin }
                        ]}
                    />}
                    <DropDown icon="ruler" base="/anthropo-measure/survey" label="Mésures" menus={[
                        { to: '/add', label: 'Nouvelle mesure', can: isAdmin },
                        { to: '/list', label: 'Liste des mesures' },
                        { to: '/add-student', label: 'Mesurer des étudiants', can: isAdmin }
                    ]} />

                    <GroupSeparator title="Cantine scolaire" />
                    <DropDown label="Aliments" base="/cantine" icon="cookie" menus={[
                        { to: '/add-conso', label: 'Ajouter', can: isAdmin },
                        { to: '/list-conso', label: 'Liste des aliments' }
                    ]}/>
                    <DropDown label="Consommations" base="/cantine" icon="bowl-rice" menus={[
                        { to: '/add-conso', label: 'Ajouter un consommation', can: isAdmin },
                        { to: '/list-conso', label: 'Liste des consommations' },
                        { to: '/import-conso', label: 'Importer des consommations', can: isAdmin },
                        { to: '/import-conso', label: 'Statistique des consommations', can: isAdmin }
                    ]}/>

                    <GroupSeparator title="Gestion des prix" />
                    <DropDown label="Articles" base="/prices/articles" icon="list" menus={[
                        { to: '/add', label: 'Ajouter un article', can: isAdmin },
                        { to: '/list', label: 'Liste des articles'}
                    ]} />

                    <DropDown label="Unités" base="/prices/units" icon="scale-balanced" menus={[
                        { to: '/add', label: 'Nouveau unité', can: isAdmin },
                        { to: '/list', label: 'Liste des unités' }
                    ]}/>

                    <DropDown label="Gestion des prix" base="/prices/manage" icon="money-bill" menus={[
                        { to: '/add', label: "Renseigner un prix d'articles", can: isAdmin },
                        { to: '/list', label: "Liste des prix d'articles" }
                    ]}/>

                    <DropDown label="Sites" base="/prices/sites" icon="home" menus={[
                        { to: '/add', label: 'Ajouter un site', can: isAdmin },
                        { to: '/list', label: 'Liste des sites' }
                    ]}/>

                    <GroupSeparator title="Jardin scolaire" />
                    <NavItem icon="cheese" to="/scholar-garden/engrais" label="Engrais" />
                    <NavItem icon="seedling" to="/scholar-garden/semences" label="Sémences" />
                    <NavItem icon="screwdriver-wrench" to="/scholar-garden/semences" label="Matériels" />
                    <DropDown label="Gérer les jardins" base="/scholar-garden" icon="cog" menus={[
                        { to: '/add', label: 'Nouveau jardin' },
                        { to: '/list', label: 'Liste des jardins' },
                        { to: '/steps', label: 'Etapes' },
                        { to: '/steps-data', label: 'Ajouter des données' }
                    ]}/>

                    <GroupSeparator title="Divers" />
                    <NavItem icon="file" to="/documents" label="Documents" />
                </ul>
            </nav>

            <div className="app-sidepanel-footer">
                <nav className="app-nav app-nav-footer">
                    <ul className="app-menu footer-menu list-unstyled">
                        <NavItem to="/about" active={pathname === "/about"} icon="info" label="A propos" />
                        <NavItem to="/contributors" active={pathname === "/contributors"} icon="users" label="Contributeurs" />
                        <NavItem to="/settings" active={pathname === "/settings"} icon="cog" label="Paramètres" />
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