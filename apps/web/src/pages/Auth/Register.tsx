import { useAuth } from 'hooks'
import { FormEvent, ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Block, Button, Checkbox, Input } from 'ui'
import { config } from '@renderer/config'
import { toast } from 'react-toastify'

export function Register(): ReactNode {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [user, setUser] = useState<Partial<User>>({
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: ''
    })
    const [errors, setErrors] = useState<{
        username: string[]
        password: string[]
        name: string[]
        email: string[]
        password_confirmation: string[]
    }>()

    const { register, loading } = useAuth<User>({
        baseUrl: config.baseUrl
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await register(user)

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
        <div className="d-flex justify-content-center">
            <Block className="w-50">
                <form method="POST" onSubmit={handleSubmit}>
                    <h3 className="text-center mb-5">Créer un compte</h3>
                    <Input
                        value={user.name}
                        onChange={({ target }): void => {
                            setUser({ ...user, name: target.value })
                            if (target.value.length > 0 && errors)
                                setErrors({ ...errors, name: [] })
                        }}
                        required={false}
                        label="Nom"
                        className="mb-3"
                        error={errors?.name}
                    />
                    <Input
                        value={user.username}
                        onChange={({ target }): void => {
                            setUser({ ...user, username: target.value })
                            if (target.value.length > 0 && errors)
                                setErrors({ ...errors, username: [] })
                        }}
                        required={false}
                        label="Nom d'utilisateur"
                        className="mb-3"
                        error={errors?.username}
                    />
                    <Input
                        value={user.email}
                        onChange={({ target }): void => {
                            setUser({ ...user, email: target.value })
                            if (target.value.length > 0 && errors) {
                                if (target.value.indexOf('@') === -1)
                                    setErrors({ ...errors, email: ['Adresse email invalide'] })
                                else setErrors({ ...errors, email: [] })
                            }
                        }}
                        required={false}
                        label="Adresse email"
                        className="mb-3"
                        error={errors?.email}
                    />
                    <Input
                        value={user.password}
                        onChange={({ target }): void => {
                            setUser({ ...user, password: target.value })
                            if (target.value.length > 0 && errors)
                                setErrors({ ...errors, password: [] })
                        }}
                        required={false}
                        type={showPassword ? "text" : "password"}
                        label="Mot de passe"
                        className="mb-3"
                        error={errors?.password}
                    />
                    <Input
                        value={user.password_confirmation}
                        onChange={({ target }): void => {
                            setUser({ ...user, password_confirmation: target.value })
                            if (target.value.length > 0 && errors)
                                setErrors({ ...errors, password_confirmation: [] })
                        }}
                        required={false}
                        type={showPassword ? "text" : "password"}
                        label="Confirmer le mot de passe"
                        className="mb-4"
                        error={errors?.password_confirmation}
                    />
                    <div className="mb-5">
                        <Checkbox checked={showPassword} onCheck={() => setShowPassword(!showPassword)} label="Afficher le mot de passe" />
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to="/auth/login">Se connecter</Link>
                        <Button
                            loading={loading}
                            type="submit"
                            icon="right-to-bracket"
                            mode="primary"
                        >
                            Valider
                        </Button>
                    </div>
                </form>
            </Block>
        </div>
    )
}
