/* eslint-disable react-hooks/exhaustive-deps */
import { AlertDanger } from "@base/components";
import { config } from "@base/config";
import { useApi, useAuthStore } from "hooks";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Block, Button, Input, PageTitle } from "ui";

/**
 * Description placeholder
 *
 * @export
 * @returns {ReactNode}
 */
export function Profile(): ReactNode {
    const [user, setUser] = useState<User>()
    const { Client } = useApi({  url: '/auth' })
    const { Client: UpdateClient, RequestState, error } = useApi({ url: '/auth/users' })
    const { user: currentUser, updateUser } = useAuthStore();

    const navigate = useNavigate()

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data: Record<string, unknown> = {}
        new FormData(e.target as HTMLFormElement).forEach((value, key) => {
            data[key] = value
        })

        if (user) {
            const response = await UpdateClient.patch(user.id, {...data, security: false})
            if (response.ok) {
                toast("Modifié", { type: 'success', position: config.toastPosition })
                if (currentUser) updateUser({
                    ...currentUser,
                    username: data.username as string,
                    email: data.email as string,
                    name: data.name as string
                })
                navigate("/auth/account", { replace: true })
            } else {
                toast("Erreur de modification", { type: "error", position: config.toastPosition })
            }
        }
    }, [user])

    const getUser = useCallback(async (): Promise<void> => {
        const user = await Client.get({}, '/user')
        if (user) setUser(user as unknown as User)
    }, [])

    useEffect(() => {
        getUser()
    }, [])

    return <>
        <PageTitle title="Modifier mon compte"/>
        <Block>
            {user ? <form method="post" onSubmit={handleSubmit}>
                <UnprocessableEntityError error={error} />

                <div className="row mb-4">
                    <div className="col-6 mb-3">
                        <Input name="name" label="Nom" placeholder="Nom" defaultValue={user.name} />
                    </div>
                    <div className="col-6 mb-3">
                        <Input name="occupation" label="Occupation" placeholder="Ex: AP ORN Ats" defaultValue={user.occupation} />
                    </div>
                    <div className="col-6 mb-3">
                        <Input name="email" label="Adresse e-mail" placeholder="Adresse e-mail" defaultValue={user.email} />
                    </div>
                    <div className="col-6">
                        <Input name="username" label="Pseudo" placeholder="Pseudo" defaultValue={user.username} />
                    </div>
                    <div className="col-6">
                        <Input name="password" type="password" label="Mot de passe" placeholder="Mot de passe" />
                    </div>
                </div>
                <Button icon="save" mode="primary" loading={RequestState.creating || RequestState.updating} type="submit">Enregistrer</Button>
            </form> : <ProfileLoading />}
        </Block>
    </>
}

export function ProfileLoading(): ReactNode {
    return <>
        <div className="row mb-4">
            <div className="col-6 mb-3">
                <Skeleton height={30} />
            </div>
            <div className="col-6 mb-3">
                <Skeleton height={30} />
            </div>
            <div className="col-6">
                <Skeleton height={30} />
            </div>
            <div className="col-6">
                <Skeleton height={30} />
            </div>
        </div>
        <Skeleton height={30} style={{ width: 200 }} />
    </>
}

export function UnprocessableEntityError({error}: {error: APIError | null}) {
    return <>
        {error?.data?.errors && <AlertDanger>
            <ul className="mb-0 pb-0">
                {Object.keys(error.data.errors).map(key => {
                    const value = error.data.errors[key]
                    return <li key={key}>{value.at(0)}</li>
                })}
            </ul>
        </AlertDanger>}
    </>
}