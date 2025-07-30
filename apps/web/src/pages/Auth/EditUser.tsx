import { PrimaryLink } from '@base/components'
import { Block, PageTitle } from 'ui'
import { RegisterForm } from '@base/pages/Auth'
import { ReactNode, useEffect, useState } from 'react'
import { useApi } from 'hooks'
import { useNavigate, useParams } from 'react-router'

/**
 * Page d'accueil de gestion des étudiants
 * @returns ReactNode
 */
export function EditUser(): ReactNode {
    const [user, setUser] = useState<User>()
    const { Client, RequestState } = useApi<User>({
        url: '/auth/get-user'
    })

    const { id } = useParams()
    const navigate = useNavigate()

    const getData = async (): Promise<void> => {
        const data = await Client.find(id as string)
        if (data) setUser(data)
        else navigate("not-found")
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <PageTitle title="Modifier un utilisateur">
                <PrimaryLink permission="user.view" to="/user/list" icon='list'>
                    Liste des utilisateurs
                </PrimaryLink>
            </PageTitle>

            <Block>
                {RequestState.loading ? <span className='text-center w-100 d-block'>Chargement...</span> : <RegisterForm external={false} editUser={user} />}
            </Block>
        </>
    )
}