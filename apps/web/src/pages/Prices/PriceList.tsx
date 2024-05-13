import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, Button } from "ui";
import { config, getToken } from '../../config'
import { ActivityLoading } from "@renderer/components";
import { Pagination } from 'react-laravel-paginex'
import { Link } from "react-router-dom";

export function PriceList(): ReactNode {
    const {
        Client,
        datas: activities,
        RequestState
    } = useApi<Activity>({
        baseUrl: config.baseUrl,
        token: getToken(),
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
        <div className="mb-5 d-flex justify-content-between align-items-center">
            <h2>Nos activités</h2>
        </div>

        {RequestState.loading && <>
            <div className="mb-4"><ActivityLoading /></div>
            <div className="mb-4"><ActivityLoading reverse /></div>
            <div className="mb-4"><ActivityLoading /></div>
            <div className="mb-4"><ActivityLoading reverse /></div>
        </>}

        {activities && activities.data?.map((activity: Activity, index: number) => {
            return <Block className="mb-5" key={activity.id}>
                <div className={`d-flex justify-content-between ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-50 ${index % 2 !== 0 ? '' : 'me-4'}`}>
                        <h3 className="text-primary">{activity.title}</h3>
                        <h5 className="mb-4">{activity.place} - <i>{activity.date}</i></h5>
                        <hr />

                        <p style={{ textAlign: 'justify' }}>{activity.details}</p>

                        <Button icon="eye" mode="primary" className="mt-5 me-3">Plus de détails</Button>
                        <Link to={`/activities/edit/${activity.id}`} className="mt-5 btn btn-info"><i className="fa fa-edit me-2"></i>Modifier</Link>
                    </div>
                    <div className={`w-50 ${index % 2 !== 0 ? 'me-4' : ''}`}>
                        <div className="row">
                            {activity.images.map(image => <img className="col-6 mb-4" src={image.path} alt="" />)}
                        </div>
                    </div>
                </div>
            </Block>

        })}
        {activities?.meta?.total > activities?.meta?.per_page && <Pagination changePage={changePage} data={activities} />}
    </>
}