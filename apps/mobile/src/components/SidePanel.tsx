import { ReactNode } from "react";
import { useLocation } from "react-router";
import logo from '@base/assets/images/logo.png';
import { AppTitle, DropDown, NavItem } from "@base/components";

export function SidePanel(): ReactNode {
    const { pathname } = useLocation()

    return <div id="app-sidepanel" className="app-sidepanel sidepanel-visible">
        <div id="sidepanel-drop" className="sidepanel-drop"></div>
        <div className="sidepanel-inner d-flex flex-column">
            <AppTitle appLogo={logo} appName="ORN ATSINANANA" />
            <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
                <ul className="app-menu list-unstyled accordion" id="menu-accordion">
                    <NavItem icon="speedometer" active={pathname === "/"} to="" label="Tableau de bord" />
                    <GroupSeparator title="Consommations" />
                    <NavItem icon="plus" active={pathname === "/cantine/consommation/add"} to="/cantine/consommation/add" label="Ajouter une consommation" />
                    <NavItem icon="list" active={pathname === "/cantine/consommation/list"} to="/cantine/consommation/list" label="Historique des consommations" />

                    <GroupSeparator title="Gestion de stock" />
                    <NavItem icon="arrow-right" active={pathname === "/cantine/stocks/in"} to="/cantine/stocks/in" label="Entree en stock" />
                    <NavItem icon="arrow-left" active={pathname === "/cantine/stocks/out"} to="/cantine/stocks/out" label="Sortie de stock" />
                    <NavItem icon="file" active={pathname === "/cantine/stocks/recap"} to="/cantine/stocks/recap" label="Fiche de stock" />

                    <GroupSeparator title="Divers" />
                    <DropDown label="Outils" base="/tools" icon="tools" menus={[
                        { to: '/z-calculator', label: 'Calculateur de Z' },
                    ]} />
                </ul>
            </nav>

            <div className="app-sidepanel-footer">
                <nav className="app-nav app-nav-footer">
                    <ul className="app-menu footer-menu list-unstyled">
                        <NavItem to="/about" active={pathname === "/about"} icon="info-circle" label="A propos" />
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