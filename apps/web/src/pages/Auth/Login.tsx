import { useApi, useAuthStore } from 'hooks'
import { FormEvent, ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Input } from 'ui'
import { config } from '@renderer/config'
import { toast } from 'react-toastify'

import './Auth.modules.scss'

export function Login(): ReactNode {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{ username: string[]; password: string[] }>()
    const navigate = useNavigate()

    const { login } = useAuthStore()
    const { Client, RequestState } = useApi<User>({ baseUrl: config.baseUrl, url: '/auth' })

    const handleLogin = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await login(Client, {username: username, password: password})

        if (response.ok) {
            toast('Connecté', {
                type: 'success',
                position: config.toastPosition
            })
            navigate('/')
        } else {
            setErrors(response.data.errors)
            toast(response.statusText, {
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6 p-0">
                    <div className="login-image d-flex align-items-center justify-content-center h-100">
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="auth-container">
                        <form onSubmit={handleLogin} action="" method="post">
                            <h3 className="text-center mb-5 text-primary">Se connecter</h3>
                            <Input
                                required={false}
                                placeholder="test@example.com / orn-atsinanana"
                                onChange={({ target }): void => {
                                    setUsername(target.value)
                                    if (target.value.length > 0 && errors)
                                        setErrors({ ...errors, username: [] })
                                }}
                                value={username}
                                label="Adresse email ou nom d'utilisateur"
                                className="mb-3"
                                error={errors?.username}
                            />
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
                                className="mb-4"
                                error={errors?.password}
                            />
                            <div className="mb-5">
                                <Checkbox checked={showPassword} onCheck={() => setShowPassword(!showPassword)} label="Afficher le mot de passe" />
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <Link to="/auth/register">Demander un accès</Link>
                                <Button
                                    loading={RequestState.loading}
                                    type="submit"
                                    icon="right-to-bracket"
                                    mode="primary"
                                >
                                    Se connecter
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
