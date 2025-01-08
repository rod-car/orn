import { useApi } from 'hooks'
import { FormEvent, ReactNode, useState } from 'react'
import { Button, Input } from 'ui'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { Footer, Link } from '@base/components'
import logo from '@base/assets/images/logo.png'

export function ForgotPassword(): ReactNode {
    const [email, setEmail] = useState('')
    const { Client, RequestState, error } = useApi<User>({ url: '/auth/forgot-password' })

    const handleLogin = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await Client.post({email: email})

        if (response === undefined) {
            toast("Impossible de contacter le serveur", {
                position: config.toastPosition,
                type: 'error'
            })
            return
        }

        if (response.ok) {
            toast('Un lien de réinitialisation est envoyé dans votre boite e-mail', {
                type: 'success',
                position: config.toastPosition
            })
            setEmail("");
        } else {
            toast("Données du formulaire invalide", {
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    return <div className="app app-reset-password p-0">
        <div className="row g-0 app-auth-wrapper">
            <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
                <div className="d-flex flex-column align-content-end">
                    <div className="app-auth-body mx-auto">
                        <div className="app-auth-branding mb-4">
                            <Link className="app-logo" to="/register">
                                <img className="logo-icon me-2" src={logo} alt="logo" />
                            </Link>
                        </div>

                        <div className="auth-form-container text-start">
                            <h2 className="auth-heading text-center mb-4">Mot de passe oublié</h2>
                            <div className="auth-intro mb-4 text-center">Renseigner votre adresse email afin de recevoir un lien de réinitialisation de mot de passe.</div>
                            <form onSubmit={handleLogin} action="" method="post" className="auth-form resetpass-form">
                                <div className="email mb-3">
                                    <Input
                                        required={false}
                                        placeholder="Adresse e-mail"
                                        onChange={({ target }): void => {
                                            setEmail(target.value)
                                        }}
                                        value={email}
                                        label="Adresse email"
                                        srOnly={true}
                                        className="signin-email"
                                        error={error?.data?.errors?.email}
                                    />
                                </div>
                                <div className="text-center">
                                    <Button
                                        loading={RequestState.creating}
                                        type="submit"
                                        mode="primary"
                                        className="app-btn-primary w-100 theme-btn mx-auto">
                                        Envoyer le lien
                                    </Button>
                                </div>
                            </form>
                            <div className="auth-option text-center pt-5">
                                <Link className="app-link" to="/orn/auth/login" >Se connecter</Link> 
                                <span className="px-2">|</span> 
                                <Link className="app-link" to="/orn/auth/register" >Demander un accès</Link>
                            </div>
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

