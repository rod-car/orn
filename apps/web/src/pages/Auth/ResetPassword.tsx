import { ReactNode } from "react";
import './Auth.css'
import logo from '@base/assets/images/app-logo.svg'
import { Footer } from "@base/components";

export function ResetPassword(): ReactNode {
	return <div className="app-reset-password p-0">    	
		<div className="row g-0 app-auth-wrapper">
			<div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
				<div className="d-flex flex-column align-content-end">
					<div className="app-auth-body mx-auto">	
						<div className="app-auth-branding mb-4"><a className="app-logo" href="index.html"><img className="logo-icon me-2" src={logo} alt="logo" /></a></div>
						<h2 className="auth-heading text-center mb-4">Password Reset</h2>

						<div className="auth-intro mb-4 text-center">Enter your email address below. We'll email you a link to a page where you can easily create a new password.</div>
						<div className="auth-form-container text-left">
							<form className="auth-form resetpass-form">
								<div className="email mb-3">
									<label className="sr-only" htmlFor="reg-email">Your Email</label>
									<input id="reg-email" name="reg-email" type="email" className="form-control login-email" placeholder="Your Email" />
								</div>
								<div className="text-center">
									<button type="submit" className="btn app-btn-primary btn-block theme-btn mx-auto">Reset Password</button>
								</div>
							</form>
							<div className="auth-option text-center pt-5"><a className="app-link" href="login.html" >Log in</a> <span className="px-2">|</span> <a className="app-link" href="login.html" >Sign up</a></div>
						</div>
					</div>
					<Footer className="app-auth-footer" />
				</div> 
			</div>
			<div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
				<div className="auth-background-holder">
				</div>
				<div className="auth-background-mask"></div>
				<div className="auth-background-overlay p-3 p-lg-5">
					<div className="d-flex flex-column align-content-end h-100">
						<div className="h-100"></div>
						<div className="overlay-content p-3 p-lg-4 rounded">
							<h5 className="mb-3 overlay-title">Explore Portal Admin Template</h5>
							<div>Portal is a free Bootstrap 5 admin dashboard template. You can download and view the template license <a href="https://themes.3rdwavemedia.com/bootstrap-templates/admin-dashboard/portal-free-bootstrap-admin-dashboard-template-for-developers/">here</a>.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
}

