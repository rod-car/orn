import { ReactNode } from 'react'
import { RegisterForm } from '@base/pages/Auth'
import { Footer, Link } from '@base/components'
import logo from '@base/assets/images/logo.png';

import './Auth.modules.scss'

export function Register(): ReactNode {
    return <div className="app-signup p-0">
        <div className="row g-0 app-auth-wrapper">
            <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
                <div className="d-flex flex-column align-content-end">
                    <div className="app-auth-body mx-auto" style={{ width: 425 }}>	
                        <div className="app-auth-branding mb-4">
                            <Link className="app-logo" to="/">
                                <img className="logo-icon me-2" src={logo} alt="logo" />
                            </Link>
                        </div>
                        <h2 className="auth-heading text-center mb-4">Demander un accès</h2>
                        <div className="auth-form-container text-start mx-auto">
                            <RegisterForm />
                            <div className="auth-option text-center pt-5">A déjà un compte? <Link className="text-link" to="/auth/login" >Se connecter</Link></div>
                            </div>
                        </div>
                        <Footer className="app-auth-footer" />
                    </div>
                </div>
                <div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
                    <div className="auth-background-holder"></div>
                    <div className="auth-background-mask"></div>
                </div>
            </div>
        </div>
}
