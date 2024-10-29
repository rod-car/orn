/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { config } from '@base/config'
import { ActivityBlock, Loading, Pagination } from "@base/components";
import { PageTitle } from "ui";

export function ActivityList(): ReactNode {
    const { Client, datas: activities, RequestState } = useApi<Activity>({
        
        url: '/activities'
    })

    const queryParams = {
        paginate: true,
        perPage: 5,
        imagesCount: 4
    }

    const getActivities = async () => {
        await Client.get(queryParams)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({
            ...queryParams,
            page: data.page
        })
    }

    useEffect(() => {
        getActivities()
    }, [])

    return <>
        <PageTitle title="Nos activités" />

        {RequestState.loading && <Loading />}

        {activities && activities.data?.map((activity: Activity, index: number) => {
            return <ActivityBlock activity={activity} index={index} />
        })}

        {activities?.meta?.total > activities?.meta?.per_page && <Pagination changePage={changePage} data={activities} />}
    </>
}