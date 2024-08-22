import { ReactNode } from "react";

type NotificationCardProps = {
    type: string;
    title: string;
    duration: string;
    by?: string;
    content: string;
    actionLabel: string;
    actionUrl: string;
    avatar?: string;
}

/**
 * A component tha represents a notification card
 *
 * @export
 * @param {NotificationCardProps} props
 * @returns {ReactNode}
 */
export function NotificationCard(props: NotificationCardProps): ReactNode {
	return <div className="app-card app-card-notification shadow-sm mb-4">
		<div className="app-card-header px-4 py-3">
			<div className="row g-3 align-items-center">
				{props.avatar && <div className="col-12 col-lg-auto text-center text-lg-start">
					<img className="profile-image" src={props.avatar} alt="" />
				</div>}
				<div className="col-12 col-lg-auto text-center text-lg-start">
					<div className="notification-type mb-2"><span className="badge bg-info">{props.type}</span></div>
					<h4 className="notification-title mb-1">{props.title}</h4>
					<ul className="notification-meta list-inline mb-0">
						<li className="list-inline-item">{props.duration}</li>
						{props.by && <><li className="list-inline-item">|</li>
						<li className="list-inline-item">{props.by}</li></>}
					</ul>
				</div>
			</div>
		</div>
		<div className="app-card-body p-4">
			<div className="notification-content">{props.content}</div>
		</div>
		<div className="app-card-footer px-4 py-3">
			<a className="action-link" href={props.actionUrl}>
                {props.actionLabel}
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right ms-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                </svg>
            </a>
		</div>
	</div>
}