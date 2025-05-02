import { useAuthStore } from 'hooks'
import { ReactNode } from 'react'
import { Block, PageTitle } from 'ui'

export function HomePage(): ReactNode {
    const { user } = useAuthStore()

    return (
        <>
            <PageTitle title="Tableau de bord" />

            <Block>
                <div className="alert alert-success d-flex align-items-center" role="alert">
                    <i className="bi bi-person-circle me-2"></i>
                    <div className='fs-6'>
                        Bienvenue, vous êtes connecté en tant que <strong>{user?.name}</strong>
                    </div>
                </div>
            </Block>
        </>
    )
}
