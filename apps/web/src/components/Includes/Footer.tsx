import { ReactNode } from "react";

export function Footer({className = "app-footer"}: {className?: string}): ReactNode {
	return 	<footer className={className}>
		<div className="container text-center py-3">
		<small className="copyright">&copy; Gestion & Suivi Nutritionnel — ORN Atsinanana {new Date().getFullYear()}</small>
		</div>
	</footer>
}