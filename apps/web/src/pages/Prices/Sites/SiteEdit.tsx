import { useApi } from 'hooks'
import { ReactNode, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Block } from 'ui'
import { config } from '@base/config'
import { SiteForm } from '@base/pages/Prices'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function SiteEdit(): ReactNode {
    const { Client, data: site } = useApi<Site>({
        
        
        url: '/prices/sites'
    })

    const { id } = useParams()

    const getSite = async (id: number): Promise<void> => {
        await Client.find(id)
    }

    useEffect(() => {
        getSite(parseInt(id as string))
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                {site ? (
                    <h3 className="m-0">{site.name}</h3>
                ) : (
                    <Skeleton count={1} style={{ height: 40 }} containerClassName="w-50" />
                )}
                <NavLink to="/prices/sites/list" className="btn btn-primary">
                    <i className="bi bi-list me-2"></i>Liste des sites
                </NavLink>
            </div>

            <Block className="mb-5">
                {site ? (
                    <SiteForm editedSite={site} />
                ) : (
                    <Skeleton style={{ height: 40 }} count={4} />
                )}
            </Block>
        </>
    )
}
