/* eslint-disable react-hooks/exhaustive-deps */
import { AlertDanger, Link } from "@base/components";
import { config } from "@base/config";
import { format } from "functions";
import { useApi, useAuthStore } from "hooks";
import { CSSProperties, FormEvent, MouseEventHandler, PropsWithChildren, ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { confirmAlert } from "react-confirm-alert";
import { useNavigate } from "react-router";
import { toast } from "@base/ui";
import { Button, Checkbox, Input, PageTitle } from "ui";


/**
 * Description placeholder
 *
 * @type {CSSProperties}
 */
const styles: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: 0,
}

/**
 * Description placeholder
 *
 * @typedef {CardAccountProps}
 */
type CardAccountProps = PropsWithChildren & {
	title: string;
	icon: string;
    action?: {label: string, action: string | MouseEventHandler<HTMLButtonElement>, type?: string}
}


/**
 * Description placeholder
 *
 * @export
 * @returns {ReactNode}
 */
export function Account(): ReactNode {
    const [user, setUser] = useState<User>()
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [showChangeName, setShowChangeName] = useState(false)
    const [showChangeOccupation, setShowChangeOccupation] = useState(false)
    const [showChangeEmail, setShowChangeEmail] = useState(false)
    const [showChangeUsername, setShowChangeUsername] = useState(false)
    const { lastLogin } = useAuthStore()

    const roles = useMemo(() => ["Invité", "Administrateur", "Super administrateur"], [])
	const { Client } = useApi({
		url: '/auth'
	})

    const getUser = useCallback(async (): Promise<void> => {
        const user = await Client.get({}, '/user')
        if (user) setUser((user as unknown as {items: Record<string, unknown>}).items.user as unknown as User)
    }, [])

    useEffect(() => {
        getUser()
    }, [])

    const deleteUser = useCallback(function() {
        if (user) {
            confirmAlert({
                title: 'Question',
                message: 'Vous ne pourrez plus acceder au plateforme après cette suppression.\nVoulez-vous continuer ?',
                buttons: [
                    {
                        label: 'Oui',
                        onClick: async (): Promise<void> => {
                            const response = await Client.destroy(user.id)
                            if (response.ok) {
                                toast('Compte supprimé', {
                                    closeButton: true,
                                    type: 'success'
                                })
                            } else {
                                toast('Erreur de suppression', {
                                    closeButton: true,
                                    type: 'error'
                                })
                            }
                        }
                    },
                    {
                        label: 'Non',
                        onClick: () =>
                            toast('Annulé', {
                                closeButton: true,
                                type: 'error'
                            })
                    }
                ]
            })
        }
    }, [user])

    const toggleChangePassword = useCallback(function() {
        setShowChangePassword(v => !v);
    }, [])

    const toggleChangeName = useCallback(function(update?: boolean) {
        setShowChangeName(v => !v);
        if (update === true) getUser();
    }, [])

    const toggleChangeOccupation = useCallback(function(update?: boolean) {
        setShowChangeOccupation(v => !v);
        if (update === true) getUser();
    }, [])

    const toggleChangeEmail = useCallback(function(update?: boolean) {
        setShowChangeEmail(v => !v);
        if (update === true) getUser();
    }, [])

    const toggleChangeUsername = useCallback(function(update?: boolean) {
        setShowChangeUsername(v => !v);
        if (update === true) getUser();
    }, [])

	return <>
        <PageTitle title="Mon compte"/>
		<div className="row gy-4">
			<div className="col-12 col-lg-6">
				<CardAccount title="Profil" icon="person" action={{ label: "Modifier mon profil", action: "/auth/profile" }}>
                    <CardAccountItem
                        showComponent={showChangeName}
                        action={{
                            label: 'Éditer',
                            action: toggleChangeName,
                            component: <ChangeFieldComponent field="name" user={user} onClose={toggleChangeName} />
                        }}
                        title="Nom"
                        value={user ? user.name : 'Chargement'}
                    />
                    <CardAccountItem
                        showComponent={showChangeOccupation}
                        action={{
                            label: 'Éditer',
                            action: toggleChangeOccupation,
                            component: <ChangeFieldComponent field="occupation" user={user} onClose={toggleChangeOccupation} />
                        }}
                        title="Occupation"
                        value={user ? user.occupation : 'Chargement'}
                    />
                    <CardAccountItem
                        showComponent={showChangeEmail}
                        action={{
                            label: 'Éditer',
                            action: toggleChangeEmail,
                            component: <ChangeFieldComponent field="email" user={user} onClose={toggleChangeEmail} />
                        }}
                        title="Adresse e-mail"
                        value={user ? user.email : 'Chargement'}
                    />
                    <CardAccountItem
                        showComponent={showChangeUsername}
                        action={{
                            label: 'Éditer',
                            action: toggleChangeUsername,
                            component: <ChangeFieldComponent field="username" user={user} onClose={toggleChangeUsername} />
                        }}
                        title="Nom d'utilisateur"
                        value={user ? user.username : 'Chargement'}
                    />
                </CardAccount>
			</div>
            <div className="col-12 col-lg-6">
				<CardAccount title="Préférences" icon="sliders">
                    <CardAccountItem action={{ url: '#', label: 'Changer' }} title="Langue" value="Français" />
                    <CardAccountItem action={{ url: '#', label: 'Éditer' }} title="Notifications par e-mail" value="Oui" />
                </CardAccount>
			</div>
			<div className="col-12 col-lg-6">
				<CardAccount
                    icon="shield"
                    title="Securité"
                    action={{ action: deleteUser, label: "Supprimer mon compte" }}
                >
                    <CardAccountItem
                        showComponent={showChangePassword}
                        action={{
                            label: 'Changer',
                            action: toggleChangePassword,
                            component: <ChangePasswordComponent user={user} onClose={toggleChangePassword} />
                        }}
                        title="Mot de passe"
                        value="**********"
                    />
                    <CardAccountItem title="Type de compte" value={user ? roles[user.role as unknown as number] : 'Chargement'} />
                </CardAccount>
			</div>
			<div className="col-12 col-lg-6">
				<CardAccount title="Autres informations" icon="list-ul">
                    <CardAccountItem title="Membre depuis" value={user ? format(user.created_at, "d/MM/y") : 'Chargement'} />
                    <CardAccountItem title="Dernière connexion" value={lastLogin && format(lastLogin, "d/MM/y HH:ii")} />
                </CardAccount>
			</div>
		</div>
	</>
}

/**
 * Description placeholder
 *
 * @param {CardAccountProps} props
 * @returns {ReactNode}
 */
function CardAccount(props: CardAccountProps): ReactNode {
	return <div className="app-card app-card-account shadow-sm d-flex flex-column align-items-start">
		<div className="app-card-header p-3 border-bottom-0">
			<div className="row align-items-center gx-3">
				<div className="col-auto">
					<div className="app-icon-holder" style={styles}>
						<i className={`bi bi-${props.icon}`}></i>
					</div>
				</div>
				<div className="col-auto">
					<h4 className="app-card-title text-primary">{props.title}</h4>
				</div>
			</div>
		</div>
		<div className="app-card-body px-4 w-100">
			{props.children}
		</div>
		{props.action && <div className="app-card-footer p-4 mt-auto">
            {typeof props.action.action === 'string' && <Link className={`btn app-btn-${props.action.type ?? 'secondary'}`} to={props.action.action}>{props.action.label}</Link>}
            {typeof props.action.action === 'function' && <button className={`btn app-btn-${props.action.type ?? 'secondary'}`} onClick={props.action.action}>{props.action.label}</button>}
		</div>}
	</div>
}

type CardAccountItemProps = {
    icon?: string;
	title: ReactNode;
	value: ReactNode;
	action?: {
		label: ReactNode,
		action?: ((update?: boolean) => void) | undefined,
		url?: string,
		component?: ReactNode
	};
    showComponent?: boolean;
}

/**
 * Description placeholder
 *
 * @param {CardAccountItemProps} props
 * @returns {ReactNode}
 */
function CardAccountItem(props: CardAccountItemProps): ReactNode {
	return <div className="item border-bottom py-3">
		<div className="row justify-content-between align-items-center">
			<div className={`${!props.showComponent && 'col-auto'}`}>
				{!props.showComponent && <><div className="item-label">
                    {props.icon && <i className={`fab fa-${props.icon} me-2`}></i>}
                    <strong>{props.title} </strong>
                </div>
				<div className="item-data">{props.value}</div></>}
               {props.showComponent && props.action?.component}
			</div>
            {props.action && !props.showComponent && <div className="col text-end">
                {props.action.action && <button onClick={props.action.action} type="button" className="btn-sm app-btn-secondary">{props.action.label}</button>}
				{props.action.url && <Link className="btn-sm app-btn-secondary" to={props.action.url}>{props.action.label}</Link>}
			</div>}
		</div>
	</div>
}

/**
 * Permet de modifier le mot de passe d'un utilisateur
 *
 * @returns {ReactNode}
 */
function ChangePasswordComponent({onClose, user}: {onClose: () => void, user?: User}): ReactNode {
    const { Client, RequestState, error } = useApi({ url: '/auth/users' })
    const { Client: LogoutClient } = useApi({ url: '/auth' })
    const [disconnect, setDisconnect] = useState(false);
    const { logout } = useAuthStore();
    const navigate = useNavigate()

    const handleCheck = useCallback(() => setDisconnect(v => !v), [])
    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)

        if (user) {
            const response = await Client.patch(user.id, {
                password: data.get('current_password'),
                new_password: data.get('new_password'),
                new_password_confirmation: data.get('new_password_confirmation'),
            })
            if (response.ok) {
                toast("Mot de passe modifié", { type: 'success' })

                if (disconnect) {
                    const logoutResponse = await logout(LogoutClient)
                    if (logoutResponse.ok) navigate("/auth/login", {replace: true})
                }
                onClose()
            } else {
                toast("Erreur de modification", { type: "error" })
            }
        }
    }, [disconnect])

    return <>
        {error?.data?.errors && <AlertDanger>
            <ul className="mb-0 pb-0">
                {Object.keys(error.data.errors).map(key => {
                    const value = error.data.errors[key]
                    return <li key={key}>{value.at(0)}</li>
                })}
            </ul>
        </AlertDanger>}
        <form method="POST" onSubmit={handleSubmit}>
            <Input className="mb-2" name="current_password" type="password" placeholder="Ancien mot de passe" />
            <Input className="mb-2" name="new_password" type="password" placeholder="Nouveau mot de passe" />
            <Input className="mb-2" name="new_password_confirmation" type="password" placeholder="Confirmer nouveau mot de passe" />
            <Checkbox checked={disconnect} onCheck={handleCheck} className="mb-3" label="Deconnecter de l'appareil" /><br />
            <Button permission="*" loading={RequestState.creating || RequestState.updating} mode="primary" size="md" className="me-2" type="submit">Enregistrer</Button>
            <Button permission="*" onClick={onClose} mode="danger">Fermer</Button>
        </form>
    </>
}

type ChangeFieldComponentProps = {
    onClose: (update?: boolean) => void;
    user?: User;
    field: keyof User;
}


/**
 * Permet de changer a la volée certain information de l'utilisateur
 *
 * @param {ChangeFieldComponentProps} param0
 * @param {(update?: boolean) => void} param0.onClose
 * @param {User} param0.user
 * @param {(string | number | symbol)} param0.field
 * @returns {ReactNode}
 */
function ChangeFieldComponent({onClose, user, field}: ChangeFieldComponentProps): ReactNode {
    const { Client, RequestState, error } = useApi({ url: '/auth/users' })
    const [password, setPassword] = useState("")
    const { user: currentUser, updateUser } = useAuthStore();

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)

        if (user) {
            const response = await Client.patch(user.id, {[field]: data.get(field), password: data.get('password'), security: false})
            if (response.ok) {
                toast("Modifié", { type: 'success' })
                if (currentUser) updateUser({
                    ...currentUser,
                    [field]: data.get(field) as string,
                })
                onClose(true)
            } else {
                toast("Erreur de modification", { type: "error" })
                setPassword("");
            }
        }
    }, [])

    return <>
        {error?.data?.errors && <AlertDanger>
            <ul className="mb-0 pb-0">
                {Object.keys(error.data.errors).map(key => {
                    const value = error.data.errors[key]
                    return <li key={key}>{value.at(0)}</li>
                })}
            </ul>
        </AlertDanger>}
        <form method="POST" onSubmit={handleSubmit}>
            <Input className="mb-2" defaultValue={user && user[field]} name={field} type="text" placeholder="Renseigner" />
            <Input value={password} onChange={({target}) => setPassword(target.value)}  className="mb-3" name="password" type="password" placeholder="Mot de passe" />
            <Button permission="*" loading={RequestState.creating || RequestState.updating} mode="primary" size="md" className="me-2" type="submit">Enregistrer</Button>
            <Button permission="*" onClick={() => onClose(false)} mode="danger">Fermer</Button>
        </form>
    </>
}