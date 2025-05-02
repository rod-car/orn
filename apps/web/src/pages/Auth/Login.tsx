import { useApi, useAuthStore } from 'hooks'
import { FormEvent, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Input } from 'ui'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { Footer, Link } from '@base/components'
import logo from '@base/assets/images/logo.png'

export function Login(): ReactNode {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ username: string[]; password: string[] }>()

    const { login } = useAuthStore()
    const { Client } = useApi<User>({ url: '/auth' })

    const handleLogin = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        setLoading(true)
        const response = await login(Client, {username: username, password: password})

        if (response === undefined) {
            toast("Impossible de contacter le serveur", {
                position: config.toastPosition,
                type: 'error'
            })
            setLoading(false)
            return
        }

        if (response.ok) {
            toast('Connecté', {
                type: 'success',
                position: config.toastPosition
            })
        } else {
            setErrors(response.data.errors)
            toast("Données du formulaire invalide", {
                type: 'error',
                position: config.toastPosition
            })
            setPassword("")
        }
        setLoading(false)
    }

    return <div className="app-login p-0">
        <div className="row g-0 app-auth-wrapper">
            <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
                <div className="d-flex flex-column align-content-end">
                    <div className="app-auth-body mx-auto">
                        <div className="app-auth-branding mb-4">
                            <Link className="app-logo" to="/register">
                                <img className="logo-icon me-2" src={logo} alt="logo" />
                            </Link>
                        </div>
                        <h2 className="auth-heading text-center mb-5">Se connecter</h2>
                        <div className="auth-form-container text-start">
                            <form onSubmit={handleLogin} action="" method="post" className="auth-form login-form">
                                <div className="email mb-3">
                                    <Input
                                        required={false}
                                        placeholder="Adresse e-mail ou nom d'utilisateur"
                                        onChange={({ target }): void => {
                                            setUsername(target.value)
                                            if (target.value.length > 0 && errors)
                                                setErrors({ ...errors, username: [] })
                                        }}
                                        value={username}
                                        label="Adresse email ou nom d'utilisateur"
                                        srOnly={true}
                                        className="signin-email"
                                        error={errors?.username}
                                    />
                                </div>
                                <div className="password mb-3">
                                    <Input
                                        required={false}
                                        onChange={({ target }): void => {
                                            setPassword(target.value)
                                            if (target.value.length > 0 && errors)
                                                setErrors({ ...errors, password: [] })
                                        }}
                                        value={password}
                                        type={showPassword ? "text" : "password"}
                                        label="Mot de passe"
                                        placeholder="Mot de passe"
                                        className="signin-password"
                                        srOnly
                                        error={errors?.password}
                                    />

                                    <div className="extra mt-3 row justify-content-between">
                                        <div className="col-6">
                                            <Checkbox checked={showPassword} onCheck={() => setShowPassword(!showPassword)} label="Afficher le mot de passe" />
                                        </div>
                                        <div className="col-6">
                                            <div className="forgot-password text-end">
                                                <Link to="/auth/forgot-password">Mot de passe oublié?</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Button
                                        loading={loading}
                                        type="submit"
                                        mode="primary"
                                        className="app-btn-primary w-100 theme-btn mx-auto">
                                        Se connecter
                                    </Button>
                                </div>
                            </form>
                            <div className="auth-option text-center pt-5">Pas de compte? Demander un accès <Link className="text-link" to="/auth/register">ici</Link>.</div>
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
