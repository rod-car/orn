import { ReactNode } from "react";

type NotificationItemProps = {
    image: string;
    message: string;
    duration: string;
    to: string
}

export function NotificationsMenu(): ReactNode {
    return <div className="app-utility-item app-notifications-dropdown dropdown">
        <a className="dropdown-toggle no-toggle-arrow" id="notifications-dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false" title="Notifications">
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bell icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z" />
                <path fillRule="evenodd" d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
            </svg>
            <span className="icon-badge">0</span>
        </a>

        <div className="dropdown-menu p-0" aria-labelledby="notifications-dropdown-toggle">
            <div className="dropdown-menu-header p-3">
                <h5 className="dropdown-menu-title mb-0">Notifications</h5>
            </div>
            <div className="dropdown-menu-content">
                {/*<NotificationItem duration="2hours ago" image="" message="John messaged you" to="notifications.html" />*/}
            </div>

            <div className="dropdown-menu-footer p-2 text-center">
                <a href="notifications.html">View all</a>
            </div>
        </div>
    </div>
}

function NotificationItem({image, message, duration, to}: NotificationItemProps): ReactNode {
    image = "assets/images/profiles/profile-2.png"
    return <div className="item p-3">
        <div className="row gx-2 justify-content-between align-items-center">
            <div className="col-auto">
                <img className="profile-image" src={image} alt="" />
            </div>
            <div className="col">
                <div className="info">
                    <div className="desc">{message}</div>
                    <div className="meta"> {duration}</div>
                </div>
            </div>
        </div>
        <a className="link-mask" href={to}></a>
    </div>
}