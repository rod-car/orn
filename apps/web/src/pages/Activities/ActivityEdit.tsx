/* eslint-disable react-hooks/exhaustive-deps */
import { Block, PageTitle } from 'ui'
import { useApi } from 'hooks'
import { ReactNode, useEffect } from 'react'
import { ActivityForm } from './ActivityForm'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router-dom'
import { PrimaryLink } from '@base/components'
import 'react-loading-skeleton/dist/skeleton.css'

export function ActivityEdit(): ReactNode {
    const { Client, data: activity } = useApi<Activity>({
        
        url: '/activities'
    })

    const { id } = useParams()

    const getActivity = async (id: number) => await Client.find(id)

    useEffect(() => {
        getActivity(parseInt(id as string))
    }, [])

    return (
        <>
            <PageTitle title={activity ? activity.title : "Chargement en cours"}>
                <PrimaryLink to="/activities/admin/list" icon="list">
                    Liste des activités
                </PrimaryLink>
            </PageTitle>

            <Block>
                {activity 
                    ? <ActivityForm editedActivity={activity} />
                    : <Skeleton style={{ height: 40 }} count={4} />
                }
            </Block>
        </>
    )
}
