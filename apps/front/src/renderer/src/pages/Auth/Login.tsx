import { useAuth } from 'hooks'
import { FormEvent, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from 'ui'
import { config } from '../../../config'
import { toast } from 'react-toastify'

export function Login(): ReactNode {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ username: string[]; password: string[] }>()
    const { login, loading } = useAuth<User>({
        baseUrl: config.baseUrl
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await login({ username: username, password: password })

        if (response.ok) {
            toast('Connecté', {
                type: 'success',
                position: 'bottom-right'
            })
            window.electron.ipcRenderer.send('logged-in', true)
        } else {
            setErrors(response.data.errors)
            toast(response.statusText, {
                type: 'error',
                position: 'bottom-right'
            })
        }
    }

    return (
        <div className="p-5 rounded">
            <form onSubmit={handleSubmit} action="" method="post">
                <h3 className="text-center mb-5">Se connecter</h3>
                <Input
                    required={false}
                    placeholder="test@example.com"
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
                    type="password"
                    label="Mot de passe"
                    className="mb-5"
                    error={errors?.password}
                />
                <div className="d-flex justify-content-between align-items-center">
                    <Link to="/register">Créer un compte</Link>
                    <Button
                        loading={loading}
                        type="submit"
                        icon="right-to-bracket"
                        mode="primary"
                    >
                        Se connecter
                    </Button>
                </div>
            </form>
        </div>
    )
}
