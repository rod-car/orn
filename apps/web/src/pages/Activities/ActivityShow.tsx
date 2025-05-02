/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Loading, PrimaryLink } from "@base/components";
import { Block, PageTitle } from "ui";
import { useNavigate, useParams } from "react-router";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import placeholder from "@base/assets/images/placeholder.webp"

export function ActivityShow(): ReactNode {
    const { Client, data: activity, RequestState } = useApi<Activity>({
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
                <h5 className="text-primary m-0">{new Date(activity.date).toLocaleDateString()}</h5>
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
                            <LazyLoadImage
                                alt={`Image ${index + 1}`}
                                src={image.path}
                                effect="blur"
                                placeholderSrc={placeholder}
                                width="100%" />
                        </PhotoView>
                    </div>)}
                </div>
            </PhotoProvider>
        </Block>}
    </>
}