import { Button, Input } from 'ui';
import { toast } from 'react-toastify';
import { useConfigStore } from 'hooks';
import { useAuth } from 'hooks';
import { config as baseConfig } from '@base/config'
import { FormEvent, ReactNode, useState } from 'react';

export function RegisterForm(): ReactNode {
    const config = useConfigStore()

    const defaultUser = {
        name: '',
        occupation: '',
        email: '',
        username: '',
        role: "guest",
        password: 'Default.2024',
        password_confirmation: 'Default.2024'
    }

    const [showPassword] = useState(false)
    const [user, setUser] = useState<Partial<User>>(defaultUser)
    const defaultErrors = {username: [''], password: [''], name: [''], occupation: [''], email: [''], password_confirmation: [''], role: ['']}
    const [errors, setErrors] = useState<typeof defaultErrors>(defaultErrors)
    const { register, loading } = useAuth<User>({ baseUrl: config.baseUrl })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const response =await register(user);
        const message ="Demande envoyé. Elle sera validé par l'administrateur";

        if (response === undefined) {
            toast("Impossible de contacter le serveur", {
                position: baseConfig.toastPosition,
                type: 'error'
            })
            return
        }

        if (response.ok) {
            toast(message, {
                type: 'success',
                position: baseConfig.toastPosition
            })
            setUser(defaultUser)
        } else {
            setErrors(response.data.errors)
            toast(response.statusText, {
                type: 'error',
                position: baseConfig.toastPosition
            })
        }
    }

    return <form method="POST" onSubmit={handleSubmit} className="auth-form auth-signup-form">
        <div className="row">
            <div className={`email mb-3 col-12`}>
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
                    srOnly
                />
            </div>

            <div className={`email mb-3 col-12`}>
                <Input
                    value={user.occupation}
                    onChange={({ target }): void => {
                        setUser({ ...user, occupation: target.value })
                        if (target.value.length > 0 && errors)
                            setErrors({ ...errors, occupation: [] })
                    }}
                    required={false}
                    label="Occupation"
                    placeholder="Ex: Responsable nutrition"
                    className="signup-name"
                    error={errors?.occupation}
                    srOnly
                />
            </div>
        </div>

        <div className="row">
            <div className={`email mb-3 col-12`}>
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
                    srOnly
                />
            </div>

            <div className={`email mb-3 col-12`}>
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
                    srOnly
                />
            </div>
        </div>

        <div className="row">
            <div className="password mb-3 col-6">
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
                    srOnly
                />
            </div>

            <div className="password mb-3 col-6">
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
                    srOnly
                />
            </div>
        </div>

        {/*<div className="extra mb-3">
            <Checkbox checked={false} onCheck={() => {}} label={<span>J'accepte <a href="#" className="app-link">Les termes et conditions</a></span>} />
        </div>*/}
        <div className="text-center">
            <div className="d-flex justify-content-between align-items-center">
                <Button
                    permission="*"
                    loading={loading}
                    type="submit"
                    mode="primary"
                    className={`app-btn-primary w-100 theme-btn mx-auto`}
                >"Demander l'accès</Button>
            </div>
        </div>
    </form>
}
