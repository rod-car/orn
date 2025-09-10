import { ReactNode } from "react";
import { Link } from '@base/components'

/**
 * Description placeholder
 *
 * @export
 * @param {{appName: string, appLogo: string}} param0
 * @param {string} param0.appName Nom de l'application a afficher dans le titre
 * @param {string} param0.appLogo Lien pour afficher le logo
 * @returns {ReactNode}
 */
export function AppTitle({appName, appLogo}: {appName: string, appLogo: string}): ReactNode {
    return <>
        <a href="#" id="sidepanel-close" className="sidepanel-close d-xl-none">&times;</a>
        <div className="app-branding">
            <Link permission="dashboard.view" className="app-logo" to="/">
                <img className="logo-icon me-2" src={appLogo} alt="logo" />
                <span className="logo-text text-primary">{appName}</span>
            </Link>
        </div>
    </>
}