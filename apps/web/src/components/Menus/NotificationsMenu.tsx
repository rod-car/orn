import { ReactNode, useEffect } from "react";
import { useApi, useAuthStore } from "hooks";
import { Link } from "react-router-dom";

type NotificationItemProps = {
    name: string;
    email: string;
    to: string;
}

export function NotificationsMenu(): ReactNode {
    const { isAllowed } = useAuthStore();
    const canViewAccessRequests = isAllowed(["access-request.view"]);

    const { Client, datas: pendingUsers } = useApi<User>({
        url: '/auth/users',
        key: 'items'
    });

    const getPendingRequests = (): void => {
        if (canViewAccessRequests) {
            Client.get({ is_valid: false, per_page: 5 });
        }
    };

    useEffect(() => {
        getPendingRequests();
        // Rafraîchit le compteur toutes les 2 minutes sans que l'utilisateur ait à recharger la page
        const interval = setInterval(getPendingRequests, 120000);
        return () => clearInterval(interval);
    }, []);

    const count = pendingUsers?.length ?? 0;

    return <div className="app-utility-item app-notifications-dropdown dropdown">
        <a className="dropdown-toggle no-toggle-arrow" id="notifications-dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false" title="Notifications">
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bell icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z" />
                <path fillRule="evenodd" d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
            </svg>
            {count > 0 && <span className="icon-badge">{count}</span>}
        </a>

        <div className="dropdown-menu p-0" aria-labelledby="notifications-dropdown-toggle">
            <div className="dropdown-menu-header p-3">
                <h5 className="dropdown-menu-title mb-0">Notifications</h5>
            </div>
            <div className="dropdown-menu-content">
                {canViewAccessRequests && count > 0 ? (
                    pendingUsers.map((user: User) => (
                        <NotificationItem
                            key={user.id}
                            name={user.name}
                            email={user.email}
                            to="/settings/access-request"
                        />
                    ))
                ) : (
                    <div className="p-3 text-center text-muted">Aucune nouvelle notification</div>
                )}
            </div>

            <div className="dropdown-menu-footer p-2 text-center">
                <Link to="/settings/access-request">Voir toutes les demandes</Link>
            </div>
        </div>
    </div>
}

function NotificationItem({ name, email, to }: NotificationItemProps): ReactNode {
    return <div className="item p-3">
        <div className="row gx-2 justify-content-between align-items-center">
            <div className="col-auto">
                <div className="icon-badge-wrapper">
                    <i className="bi bi-person-plus"></i>
                </div>
            </div>
            <div className="col">
                <div className="desc">Nouvelle demande d'accès : <strong>{name}</strong></div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{email}</div>
            </div>
        </div>
        <Link className="link-mask" to={to}></Link>
    </div>
}