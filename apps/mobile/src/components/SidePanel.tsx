import { ReactNode } from 'react';
import { useAuthStore } from 'hooks';
import { useLocation } from 'react-router';
import logo from '@base/assets/images/logo.png';
import { AppTitle, DropDown, NavItem } from '@base/components';

export function SidePanel(): ReactNode {
    const { pathname } = useLocation()

    return <div id="app-sidepanel" className="app-sidepanel sidepanel-visible">
        <div id="sidepanel-drop" className="sidepanel-drop"></div>
        <div className="sidepanel-inner d-flex flex-column">
            <AppTitle appLogo={logo} appName="ORN ATSINANANA" />
            <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
                <ul className="app-menu list-unstyled accordion" id="menu-accordion">
                    <NavItem icon="speedometer" active={pathname === "/"} to="" label="Tableau de bord" />
                    <GroupSeparator permission={['consommation.create', 'consommation.view']} title="Consommations" />
                    <NavItem permission="consommation.create" icon="plus" active={pathname === "/cantine/consommation/add"} to="/cantine/consommation/add" label="Ajouter une consommation" />
                    <NavItem permission="consommation.view" icon="list" active={pathname === "/cantine/consommation/list"} to="/cantine/consommation/list" label="Historique des consommations" />

                    <GroupSeparator permission={['stock.in', 'stock.out', 'stock.recap']} title="Gestion de stock" />
                    <NavItem permission="stock.in" icon="arrow-right" active={pathname === "/cantine/stocks/in"} to="/cantine/stocks/in" label="Entree en stock" />
                    <NavItem permission="stock.out" icon="arrow-left" active={pathname === "/cantine/stocks/out"} to="/cantine/stocks/out" label="Sortie de stock" />
                    <NavItem permission="stock.recap" icon="file" active={pathname === "/cantine/stocks/recap"} to="/cantine/stocks/recap" label="Fiche de stock" />

                    <GroupSeparator permission={['tools.z-calculator']} title="Divers" />
                    <DropDown permission="tools.z-calculator" label="Outils" base="/tools" icon="tools" menus={[
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

function GroupSeparator({ title, permission = [] }: { title: ReactNode, permission: string|string[] }): ReactNode {
    const { isAllowed } = useAuthStore();

    if (!isAllowed(permission)) return undefined;

    return <div className="nav-link-separator">
        <span>{title}</span>
        <hr />
    </div>
}