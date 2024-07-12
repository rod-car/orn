import { useApi, useAuth } from 'hooks';
import { FormEvent, ReactNode, useState } from 'react';
import { Button, Checkbox, Input, Select } from 'ui';
import { config } from '@base/config';
import { toast } from 'react-toastify';

export function RegisterForm({ external = true }: { external?: boolean }): ReactNode {
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
        url: '/auth',
        key: 'data'
    })

    const [showPassword, setShowPassword] = useState(false)
    const [user, setUser] = useState<Partial<User>>(defaultUser)
    const defaultErrors = {username: [''], password: [''], name: [''], email: [''], password_confirmation: [''], role: ['']}
    const [errors, setErrors] = useState<typeof defaultErrors>(defaultErrors)
    const { register, loading } = useAuth<User>({ baseUrl: config.baseUrl })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = external ? await register(user) : await Client.post(user, '/add-user')
        const message = external ? "Demande envoyé. Elle sera validé par l'administrateur" : "Enregistré"

        if (response === undefined) {
            toast("Impossible de contacter le serveur", {
                position: config.toastPosition,
                type: 'error'
            })
            return
        }

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

    return <form method="POST" onSubmit={handleSubmit} className="auth-form auth-signup-form">
        <div className="row">
            <div className={`email mb-3 col-${external ? 12 : 6}`}>
                <Input
                    value={user.name}
                    onChange={({ target }): void => {
                        setUser({ ...user, name: target.value })
                        if (target.value.length > 0 && errors)
                            setErrors({ ...errors, name: [] })
                    }}
                    required={false}
                    label="Nom"
                    placeholder="Nom complet ou nom d'entreprise"
                    className="signup-name"
                    error={errors?.name}
                    srOnly={external}
                />
            </div>
            {!external && <div className="email mb-3 col-6"><Select
                value={user.role}
                onChange={({ target }): void => {
                    setUser({ ...user, role: parseInt(target.value) })
                    if (target.value.length > 0 && errors)
                        setErrors({ ...errors, role: [] })
                }}
                error={errors?.role}
                label="Rôle"
                placeholder={null}
                options={[{ id: 0, label: "Visiteur" }, { id: 1, label: "Administrateur" }, { id: 2, label: "Super administrateur" }]}
                config={{ optionKey: "id", valueKey: "label" }}
                controlled
            /></div>}
        </div>

        <div className="row">
            <div className={`email mb-3 col-${external ? 12 : 6}`}>
                <Input
                    value={user.username}
                    onChange={({ target }): void => {
                        setUser({ ...user, username: target.value })
                        if (target.value.length > 0 && errors)
                            setErrors({ ...errors, username: [] })
                    }}
                    required={false}
                    label="Nom d'utilisateur"
                    placeholder="Nom d'utilisateur"
                    error={errors?.username}
                    srOnly={external}
                />
            </div>

            <div className={`email mb-3 col-${external ? 12 : 6}`}>
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
                    placeholder="Adresse email"
                    error={errors?.email}
                    srOnly={external}
                />
            </div>
        </div>

        <div className="row">
            <div className={`password mb-3 col-6}`}>
                <Input
                    value={user.password}
                    onChange={({ target }): void => {
                        setUser({ ...user, password: target.value })
                        if (target.value !== user.password_confirmation && target.value !== "" && errors) setErrors({ ...errors, password_confirmation: ["Mot de passe ne correspond pas"] })
                        else if (target.value.length > 0 && errors) setErrors({ ...errors, password: [], password_confirmation: [] })
                    }}
                    required={false}
                    type={`${showPassword ? 'text' : 'password'}`}
                    label="Créer un mot de passe"
                    placeholder="Créer un mot de passe"
                    error={errors?.password}
                    className="signup-password"
                    srOnly={external}
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
                    required={false}
                    type={`${showPassword ? 'text' : 'password'}`}
                    label="Confirmer le mot de passe"
                    placeholder="Confirmer le mot de passe"
                    error={errors?.password_confirmation}
                    className="signup-password"
                    srOnly={external}
                />
            </div>
        </div>

        <div className="extra mb-3">
            <Checkbox checked={showPassword} onCheck={() => setShowPassword(!showPassword)} label="Afficher les mot de passe" />
        </div>

        <div className="extra mb-3">
            <Checkbox checked={false} onCheck={() => { }} label={<span>J'accepte <a href="#" className="app-link">Les termes et conditions</a></span>} />
        </div>
        <div className="text-center">
            <div className="d-flex justify-content-between align-items-center">
                <Button
                    loading={loading || RequestState.creating}
                    type="submit"
                    mode="primary"
                    className={`app-btn-primary ${external && 'w-100'} theme-btn mx-auto`}
                >{external ? "Demander l'accès" : "Enregistrer"}</Button>
            </div>
        </div>
    </form>
}
