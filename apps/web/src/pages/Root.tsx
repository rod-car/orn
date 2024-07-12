import "@base/assets/plugins/fontawesome/js/all.min.js?asset";
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "@base/components";

export function Root(): ReactNode {
	return <>
		<Header />
		<div className="app-wrapper" style={{ marginTop: 50 }}>
			<div className="app-content pt-3 p-md-3 p-lg-4">
				<div className="container-xl">
					<Outlet />
				</div>
			</div>
		</div>
		<Footer />
	</>
}
