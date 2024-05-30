import { useApi } from 'hooks'
import { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Block } from 'ui'
import { config, getToken } from '@renderer/config'
import { ActivityForm } from './ActivityForm'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function ActivityEdit(): JSX.Element {
    const { Client, data: activity } = useApi<Activity>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/activities'
    })

    const { id } = useParams()

    const getActivity = async (id: number): Promise<void> => {
        await Client.find(id)
    }

    useEffect(() => {
        getActivity(parseInt(id as string))
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                {activity ? (
                    <h3 className="m-0">{activity.title}</h3>
                ) : (
                    <Skeleton count={1} style={{ height: 40 }} containerClassName="w-50" />
                )}
                <NavLink to="/activities/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des activités
                </NavLink>
            </div>

            <Block className="mb-5">
                {activity ? (
                    <ActivityForm editedActivity={activity} />
                ) : (
                    <Skeleton style={{ height: 40 }} count={4} />
                )}
            </Block>
        </>
    )
}
