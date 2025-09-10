import { ReactNode } from "react"
import { NotificationCard } from "@base/components"

export function Notifications(): ReactNode {
	return <>
		<div className="position-relative mb-3">
			<div className="row g-3 justify-content-between">
				<div className="col-auto">
					<h1 className="app-page-title mb-0">Notifications</h1>
				</div>
				<div className="col-auto">
					<div className="page-utilities">
						<select className="form-select form-select-sm w-auto" >
							<option selected value="option-1">All</option>
							<option value="option-2">News</option>
							<option value="option-3">Product</option>
							<option value="option-4">Project</option>
							<option value="option-4">Billing</option>
						</select>
					</div>
				</div>
			</div>
		</div>

		<NotificationCard
			actionLabel="View all"
			actionUrl="#"
			by="John Doe"
			content="Lorem ipsum dolores sit"
			duration="2 min ago"
			title="Notification from John"
			type="Project"
			avatar="/image.jpeg"
		/>

		<NotificationCard
			actionLabel="View all"
			actionUrl="#"
			by="John Doe"
			content="Lorem ipsum dolores sit"
			duration="2 min ago"
			title="Notification from John"
			type="Project"
		/>

		<NotificationCard
			actionLabel="View all"
			actionUrl="#"
			content="Lorem ipsum dolores sit"
			duration="2 min ago"
			title="Notification from John"
			type="Project"
		/>

		<div className="text-center mt-4"><a className="btn app-btn-secondary" href="#">Load more notifications</a></div>
	</>
}