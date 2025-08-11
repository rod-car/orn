/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { ActivityBlock, Loading, Pagination, PrimaryLink } from "@base/components";
import { PageTitle } from "ui";

export function ActivityList(): ReactNode {
    const { Client, datas: activities, RequestState } = useApi<Activity>({
        url: '/activities'
    })

    const queryParams = {
        paginate: true,
        perPage: 5,
        imagesCount: 4,
        orderField: 'date',
        orderDirection: 'desc'
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
        <PageTitle title="Tous les activités">
            <PrimaryLink permission="activity.create" to="/activities/admin/add" icon="plus-lg">Ajouter un nouveau</PrimaryLink>
        </PageTitle>

        {RequestState.loading && <Loading />}

        {activities && (activities as unknown as {data: Activity[]}).data?.map((activity: Activity, index: number) => {
            return <ActivityBlock key={index} activity={activity} index={index} />
        })}

        {activities?.total > activities?.per_page && <Pagination changePage={changePage} data={activities} />}
    </>
}