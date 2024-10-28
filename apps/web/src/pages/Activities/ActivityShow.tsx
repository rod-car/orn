/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { config } from '@base/config'
import { Loading, PrimaryLink } from "@base/components";
import { Block, PageTitle } from "ui";
import { useNavigate, useParams } from "react-router";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export function ActivityShow(): ReactNode {
    const { Client, data: activity, RequestState } = useApi<Activity>({
        baseUrl: config.baseUrl,
        url: '/activities'
    })

    const { id } = useParams()
    const navigate = useNavigate()

    const getActivity = async (id: number) => {
        await Client.find(id)
    }

    useEffect(() => {
        if (id) getActivity(parseInt(id))
        else navigate("/not-found", { replace: true })
    }, [])

    return <>
        <PageTitle title="Détails de l'activité">
            <PrimaryLink icon="list" to="/activities/list">
                Nos activités
            </PrimaryLink>
        </PageTitle>

        {RequestState.loading && <Loading count={1} />}

        {activity && <Block>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="text-primary m-0">{activity.title}</h5>
                <h5 className="text-primary m-0">{activity.date}</h5>
            </div>

            <h6 className="">Détails</h6>
            <hr />
            <p className="border border-primary p-3 m-0" dangerouslySetInnerHTML={{ __html: activity.details as string }}></p>

            <h6 className="mt-5">Les images associés</h6>
            <hr />

            <PhotoProvider>
                <div className="row">
                    {activity.images?.map((image, index) => <div className="col-6 mb-4">
                        <PhotoView key={index} src={image.path}>
                            <img className="w-100" src={image.path} alt={`Image ${index}`} />
                        </PhotoView>
                    </div>)}
                </div>
            </PhotoProvider>
        </Block>}
    </>
}