/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Block } from 'ui'
import { SiteForm } from '@base/pages/Prices'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { PrimaryLink } from '@base/components'

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
                <PrimaryLink permission="site.view" icon='list' to="/prices/sites/list">
                    Liste des sites
                </PrimaryLink>
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
