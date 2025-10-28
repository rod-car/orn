import { FormEvent, ReactNode, useState } from 'react'
import { Footer, Link } from '@base/components'
import logo from '@base/assets/images/logo.png';
import './Auth.modules.scss'
import { useNavigate, useParams } from 'react-router';
import { config } from '@base/config';
import { useApi } from 'hooks';
import { Button, Input } from 'ui';
import { toast } from '@base/ui';

export function NewPassword(): ReactNode {
    const { token } = useParams()
    const navigate = useNavigate()

    const { Client, RequestState } = useApi<User>({
        url: '/auth/new-password',
        key: 'data'
    })

    const defaultErrors = { email: [''], password: [''], password_confirmation: [''] }
    const [errors, setErrors] = useState<typeof defaultErrors>(defaultErrors)
    const defaultUser = {
        email: '',
        password: '',
        password_confirmation: ''
    }
    const [user, setUser] = useState<Partial<User>>(defaultUser)

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await Client.post({...user, token: token})
        const message = "Mot de passe réinitialisé";

        if (response === undefined) {
            toast("Impossible de contacter le serveur", {
                type: 'error'
            })
            return
        }

        if (response.ok) {
            toast(message, {
                type: 'success'
            })
            navigate('/auth/login', { replace: true })
        }
    }

    return <div className="app-signup p-0">
        <div className="row g-0 app-auth-wrapper">
            <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
                <div className="d-flex flex-column align-content-end">
                    <div className="app-auth-body mx-auto">
                        <div className="app-auth-branding mb-4">
                            <Link className="app-logo" to="/">
                                <img className="logo-icon me-2" src={logo} alt="logo" />
                            </Link>
                        </div>
                        <h2 className="auth-heading text-center mb-4">Nouveau mot de passe</h2>
                        <div className="auth-form-container text-start mx-auto">
                            <form method="POST" onSubmit={handleSubmit} className="auth-form auth-signup-form">
                                <div className="row">
                                <div className={`email mb-3 col-6}`}>
                                        <Input
                                            value={user.email}
                                            onChange={({ target }): void => {
                                                setUser({ ...user, email: target.value })
                                                if (target.value.length > 0 && errors) setErrors({ ...errors, email: []})
                                            }}
                                            label="Adresse e-mail"
                                            placeholder="Adresse e-mail"
                                            error={errors?.email}
                                            className="signup-email"
                                            srOnly
                                        />
                                    </div>
                                    <div className={`password mb-3 col-6}`}>
                                        <Input
                                            value={user.password}
                                            onChange={({ target }): void => {
                                                setUser({ ...user, password: target.value })
                                                if (target.value !== user.password_confirmation && target.value !== "" && errors) setErrors({ ...errors, password_confirmation: ["Mot de passe ne correspond pas"] })
                                                else if (target.value.length > 0 && errors) setErrors({ ...errors, password: [], password_confirmation: [] })
                                            }}
                                            type="password"
                                            label="Nouveau mot de passe"
                                            placeholder="Nouveau mot de passe"
                                            error={errors?.password}
                                            className="signup-password"
                                            srOnly
                                        />
                                    </div>

                                    <div className={`password mb-3 col-6}`}>
                                        <Input
                                            value={user.password_confirmation}
                                            onChange={({ target }) => {
                                                setUser({ ...user, password_confirmation: target.value })
                                                if (target.value !== user.password && target.value !== "" && errors) setErrors({ ...errors, password_confirmation: ["Mot de passe ne correspond pas"] })
                                                else if (target.value.length > 0 && errors) setErrors({ ...errors, password_confirmation: [] })
                                            }}
                                            type="password"
                                            label="Confirmer le mot de passe"
                                            placeholder="Confirmer le mot de passe"
                                            error={errors?.password_confirmation}
                                            className="signup-password"
                                            srOnly
                                        />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Button
                                            loading={RequestState.creating}
                                            type="submit"
                                            mode="primary"
                                            className={`app-btn-primary w-100 theme-btn mx-auto`}
                                        >Enregistrer</Button>
                                    </div>
                                </div>
                                <div className="auth-option text-center pt-5">
                                    <Link className="text-link" to="/auth/login" >Se connecter</Link>
                                </div>
                            </form>
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
