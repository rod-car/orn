import { useApi } from 'hooks'
import { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Block } from 'ui'
import { config } from '@base/config'
import { JardinForm } from './JardinForm'
import Skeleton from 'react-loading-skeleton'

export function JardinEdit(): ReactNode {
    const { Client, data: garden } = useApi<Garden>({
        baseUrl: config.baseUrl,
        
        url: '/jardin-scolaires'
    })

    const { id } = useParams()

    const getData = async (id: number): Promise<void> => {
        await Client.find(id)
    }

    useEffect(() => {
        getData(parseInt(id as string))
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                {garden ? (
                    <h3 className="m-0">{garden.school?.name}</h3>
                ) : (
                    <Skeleton style={{ height: 40 }} containerClassName="w-50" />
                )}
                <NavLink to="/scholar-garden/list" className="btn btn-primary">
                    <i className="bi bi-list me-2"></i>Les jardins
                </NavLink>
            </div>

            <Block className="mb-5">
                {garden ? (
                    <JardinForm editedGarden={garden} />
                ) : (
                    <Skeleton style={{ height: 40 }} count={4} />
                )}
            </Block>
        </>
    )
}
