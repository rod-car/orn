import { useApi, useAuth } from 'hooks'
import { FormEvent, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Checkbox, Input, Select } from 'ui'
import { config, getToken } from '@renderer/config'
import { toast } from 'react-toastify'

export function RegisterForm({external = true}: {external?: boolean}): ReactNode {
    const defaultUser = {
        name: '',
        email: '',
        username: '',
        role: 0,
        password: external ? '' : 'Default.2024',
        password_confirmation: external ? '' : 'Default.2024'
    }

    const { Client, RequestState } = useApi<User>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/auth',
        key: 'data'
    })

    const [showPassword, setShowPassword] = useState(false)
    const [user, setUser] = useState<Partial<User>>(defaultUser)
    const [errors, setErrors] = useState<{
        username: string[]
        password: string[]
        name: string[]
        email: string[]
        role: string[]
        password_confirmation: string[]
    }>()

    const { register, loading } = useAuth<User>({
        baseUrl: config.baseUrl
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = external ? await register(user) : await Client.post(user, '/add-user')
        const message = external ? "Demande envoyé. Elle sera validé par l'administrateur" : "Enregistré"

        if (response.ok) {
            toast(message, {
                type: 'success',
                position: config.toastPosition
            })
            setUser(defaultUser)
        } else {
            setErrors(response.data.errors)
            toast(response.statusText, {
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    return (
        <form method="POST" onSubmit={handleSubmit}>
            {external && <><h3 className="text-center text-primary mb-4">Demande d'accès</h3>
            <p className='mb-5 text-center'>Demander un accès à l'administrateur</p></>}

            <div className="row">
                <div className={`col-${external ? 12 : 6}`}>
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
                </div>
                {!external && <div className="col-6"><Select
                    value={user.role}
                    onChange={({ target }): void => {
                        setUser({ ...user, role: parseInt(target.value) })
                        if (target.value.length > 0 && errors)
                            setErrors({ ...errors, role: [] })
                    }}
                    error={errors?.role}
                    label="Rôle"
                    placeholder={null}
                    options={[{id: 0, label: "Visiteur"}, {id: 1, label: "Administrateur"}, {id: 2, label: "Super administrateur"}]}
                    config={{ optionKey: "id", valueKey: "label" }}
                    controlled
                /></div>}
            </div>

            <div className="row">
                <div className={`col-${external ? 12 : 6}`}>
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
                </div>
                <div className={`col-${external ? 12 : 6}`}>
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
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <Input
                        value={user.password}
                        onChange={({ target }): void => {
                            setUser({ ...user, password: target.value })
                            if (target.value !== user.password_confirmation && user.password_confirmation !== "") setErrors({ ...errors, password_confirmation: ["Mot de passe ne correspond pas"] })
                            if (target.value.length > 0 && errors)
                                setErrors({ ...errors, password: [] })
                        }}
                        required={false}
                        type={showPassword ? "text" : "password"}
                        label="Mot de passe"
                        className="mb-3"
                        error={errors?.password}
                    />
                </div>
                <div className="col-6">
                    <Input
                        value={user.password_confirmation}
                        onChange={({ target }): void => {
                            setUser({ ...user, password_confirmation: target.value })
                            if (target.value !== user.password && target.value !== "") setErrors({ ...errors, password_confirmation: ["Mot de passe ne correspond pas"] })
                            if (target.value.length > 0 && errors && target.value === user.password)
                                setErrors({ ...errors, password_confirmation: [] })
                        }}
                        required={false}
                        type={showPassword ? "text" : "password"}
                        label="Confirmer le mot de passe"
                        className="mb-4"
                        error={errors?.password_confirmation}
                    />
                </div>
            </div>
            <div className="mb-5">
                <Checkbox checked={showPassword} onCheck={() => setShowPassword(!showPassword)} label="Afficher les mot de passe" />
            </div>
            <div className="d-flex justify-content-between align-items-center">
                {external && <Link to="/auth/login">Se connecter</Link>}
                <Button
                    loading={loading || RequestState.creating}
                    type="submit"
                    icon="right-to-bracket"
                    mode="primary"
                >
                    {external ? "Demander l'accès" : "Enregistrer"}
                </Button>
            </div>
        </form>
    )
}
