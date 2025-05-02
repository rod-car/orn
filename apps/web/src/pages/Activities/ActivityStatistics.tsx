import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Link } from "@base/components";
import { Block, Button, PageTitle } from "ui";
import { ActivityLoading } from "@base/components";

export function ActivityStatistics(): ReactNode {
    const { Client, datas: activities, RequestState } = useApi<Activity>({
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
            <Link to="/activities/list" className="btn primary-link">
                <i className="bi bi-list me-2"></i>Tous nos activités
            </Link>
        </PageTitle>

        {RequestState.loading && <>
            <div className="mb-4"><ActivityLoading /></div>
            <div className="mb-4"><ActivityLoading reverse /></div>
            <div className="mb-4"><ActivityLoading /></div>
            <div className="mb-4"><ActivityLoading reverse /></div>
        </>}

        {activities && activities.map((activity, index) => {
            return <Block className="mb-5" key={activity.id}>
                <div className={`d-flex justify-content-between ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-50 ${index % 2 !== 0 ? '' : 'me-4'}`}>
                        <h3 className="text-primary">{activity.title}</h3>
                        <h5 className="mb-4">{activity.place} - <i>{activity.date}</i></h5>
                        <hr />

                        <p>{activity.details}</p>

                        <Button icon="eye" mode="primary" className="mt-5">Plus de détails</Button>
                    </div>
                    <div className={`w-50 ${index % 2 !== 0 ? 'me-4' : ''}`}>
                        <div className="row">
                            {activity.images.map(image => <img className="col-6 mb-4" src={image.path} alt="" />)}
                        </div>
                    </div>
                </div>
            </Block>
        })}
    </>
}