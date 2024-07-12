import { ReactNode } from "react";
import { AppTitle, DropDown, NavItem } from "@base/components";
import logo from '@base/assets/images/logo.png';

export function SidePanel(): ReactNode {
    return <div id="app-sidepanel" className="app-sidepanel">
        <div id="sidepanel-drop" className="sidepanel-drop"></div>
        <div className="sidepanel-inner d-flex flex-column">
            <AppTitle appLogo={logo} appName="PLATEFORME ORN" />
            <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
                <ul className="app-menu list-unstyled accordion" id="menu-accordion">
                    <NavItem icon="home" active to="/" label="Tableau de bord" />
                    <GroupSeparator title="Mesure anthropométrique" />
                    <DropDown icon="list" label="Etudiants" menus={[
                        { label: "Sous menu 1", to:"Notifications.html" },
                        { label: "Sous menu 2", to:"Notifications.html" },
                        { label: "Sous menu 3", to:"Notifications.html" }
                    ]} />
                    <DropDown icon="list" label="Ecoles" menus={[
                        { label: "Sous menu 1", to:"Notifications.html" },
                        { label: "Sous menu 2", to:"Notifications.html" },
                        { label: "Sous menu 3", to:"Notifications.html" }
                    ]} />
                    <DropDown icon="list" label="Classes" menus={[
                        { label: "Sous menu 1", to:"Notifications.html" },
                        { label: "Sous menu 2", to:"Notifications.html" },
                        { label: "Sous menu 3", to:"Notifications.html" }
                    ]} />
                </ul>
            </nav>

            <div className="app-sidepanel-footer">
                <nav className="app-nav app-nav-footer">
                    <ul className="app-menu footer-menu list-unstyled">
                        <NavItem to="index.html" icon="cog" label="Settings" />
                    </ul>
                </nav>
            </div>
        </div>
    </div>
}

function GroupSeparator({title}: {title: ReactNode}): ReactNode {
    return <div className="nav-link-separator">
        <span>{title}</span>
        <hr />
    </div>
}