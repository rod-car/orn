import { ReactNode } from "react";

export function Footer({className = "app-footer"}: {className?: string}): ReactNode {
	return 	<footer className={className}>
		<div className="container text-center py-3">
		<small className="copyright">Designed with <span className="sr-only">love</span><i className="fas fa-heart" style={{ color: '#fb866a' }}></i> by <a className="app-link" href="http://themes.3rdwavemedia.com" target="_blank">Xiaoying Riley</a> for developers</small>
		</div>
	</footer>
}