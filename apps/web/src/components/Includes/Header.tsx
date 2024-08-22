import { ReactNode } from "react";
import { NotificationsMenu, SearchBar, SettingsMenu, UserMenu, SidePanel } from "@base/components";

export function Header(): ReactNode {
    return <header className="app-header fixed-top">
        <div className="app-header-inner">
            <div className="container-fluid py-2">
                <div className="app-header-content">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-auto">
                            <a id="sidepanel-toggler" className="sidepanel-toggler d-inline-block d-xl-none" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" role="img">
                                    <title>Menu</title>
                                    <path stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M4 7h22M4 15h22M4 23h22"></path>
                                </svg>
                            </a>
                        </div>
                        <SearchBar />
                        <div className="app-utilities col-auto">
                            <NotificationsMenu />
                            <SettingsMenu />
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <SidePanel />
    </header>
}