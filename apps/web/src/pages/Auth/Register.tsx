import { ReactNode } from 'react'
import { RegisterForm } from '@renderer/pages/Auth'
import './Auth.modules.scss'

export function Register(): ReactNode {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6 p-0">
                    <div className="register-image d-flex align-items-center justify-content-center h-100">
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="auth-container">
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
