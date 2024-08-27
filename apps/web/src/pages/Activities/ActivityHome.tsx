/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, PageTitle } from "ui";
import { config } from '@base/config'
import { PrimaryLink } from "@base/components";
import { Loading, ActivityBlock } from "@base/components";

export function ActivityHome(): ReactNode {
    const { Client, datas: activities, RequestState } = useApi<Activity>({
        baseUrl: config.baseUrl,
        url: '/activities',
        key: 'data'
    })

    const getActivities = async () => {
        await Client.get({
            imagesCount: 4,
            take: 5
        })
    }

    useEffect(() => {
        getActivities()
    }, [])

    return <>
        <PageTitle title="Nos dernières activités">
            <PrimaryLink to="/activities/list" icon="list">
                Tous nos activités
            </PrimaryLink>
        </PageTitle>

        {RequestState.loading && <Loading />}

        {activities && activities.length === 0 && <Block><h6 className="text-center m-0">Aucun activités récentes</h6></Block>}

        {activities && activities.map((activity, index) => {
            return <ActivityBlock activity={activity} index={index} />
        })}
    </>
}