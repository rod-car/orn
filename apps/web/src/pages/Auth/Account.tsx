import { ReactNode } from "react"

export function Account(): ReactNode {
	return <>
		<h1 className="app-page-title">My Account</h1>
		<div className="row gy-4">
			<div className="col-12 col-lg-6">
				<CardAccount />
			</div>
			<div className="col-12 col-lg-6">
				<CardAccount />
			</div>
			<div className="col-12 col-lg-6">
				<CardAccount />
			</div>
			<div className="col-12 col-lg-6">
				<CardAccount />
			</div>
		</div>
	</>
}

function CardAccount(): ReactNode {
	return <div className="app-card app-card-account shadow-sm d-flex flex-column align-items-start">
		<div className="app-card-header p-3 border-bottom-0">
			<div className="row align-items-center gx-3">
				<div className="col-auto">
					<div className="app-icon-holder">
						<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-credit-card" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z" />
							<path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />
						</svg>
					</div>
				</div>
				<div className="col-auto">
					<h4 className="app-card-title">Payment methods</h4>
				</div>
			</div>
		</div>
		<div className="app-card-body px-4 w-100">
			<div className="item border-bottom py-3">
				<div className="row justify-content-between align-items-center">
					<div className="col-auto">
						<div className="item-label"><i className="fab fa-cc-visa me-2"></i><strong>Credit/Debit Card </strong></div>
						<div className="item-data">1234*******5678</div>
					</div>
					<div className="col text-end">
						<a className="btn-sm app-btn-secondary" href="#">Edit</a>
					</div>
				</div>
			</div>
			<div className="item border-bottom py-3">
				<div className="row justify-content-between align-items-center">
					<div className="col-auto">
						<div className="item-label"><i className="fab fa-paypal me-2"></i><strong>PayPal</strong></div>
						<div className="item-data">Not connected</div>
					</div>
					<div className="col text-end">
						<a className="btn-sm app-btn-secondary" href="#">Connect</a>
					</div>
				</div>
			</div>
		</div>
		<div className="app-card-footer p-4 mt-auto">
			<a className="btn app-btn-secondary" href="#">Manage Payment</a>
		</div>
	</div>
}