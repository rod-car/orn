import { useApi } from 'hooks'
import { Block, PageTitle } from 'ui'
import { ReactNode, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PrimaryLink } from '@base/components'

export function ViewUser(): ReactNode {
    const { id } = useParams<{ id: string }>()

    const { Client, data: user } = useApi<User>({
        url: '/users'
    })

    const getUserData = async () => {
        if (id) {
            await Client.find(id)
        }
    }

    useEffect(() => {
        getUserData()
    }, [])


    return <>
        <PageTitle title={`Profile de ${user?.items?.name}`}>
            <PrimaryLink permission="user.view" to="/user" icon='list'>
                Liste des utilisateurs
            </PrimaryLink>
        </PageTitle>

        {user && user.items && <Block>
            Redirection vers profile
        </Block>}
    </>
}