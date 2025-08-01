import { ReactNode } from "react"
import { ActivityLoading, PrimaryLink } from "@base/components"
import { range } from "functions"
import { PhotoProvider, PhotoView } from "react-photo-view"
import 'react-photo-view/dist/react-photo-view.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import placeholder from "@base/assets/images/placeholder.webp"

import './ActivityBlock.scss'

export const Loading = ({count = 8}: {count?: number}) => {
    return <div className="row">{range(count).map(index => <div key={index} className="mb-4 col-xl-3"><ActivityLoading reverse={index % 2 === 0} /></div>)}</div>
}

type ActivityBlockProps = {
    activity: Activity;
    index: number;
    single?: boolean;
}

export const ActivityBlock = ({ activity, index, single = false }: ActivityBlockProps): ReactNode => {
    const images = activity.images || [];
    const hasImages = images.length > 0;

    return (
        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12" key={activity.id}>
            <div className="card rounded shadow-lg">
                {hasImages && (
                    <PhotoProvider>
                        <PhotoView src={images[0].path}>
                            <div style={{ cursor: 'pointer' }}>
                                <LazyLoadImage
                                    alt={`Image principale`}
                                    src={images[0].path}
                                    effect="blur"
                                    placeholderSrc={placeholder}
                                    placeholder={<p>Chargement de l'image</p>}
                                    style={{
                                        width: '100%',
                                        height: '250px',
                                        objectFit: 'cover',
                                        borderTopLeftRadius: '0.5rem',
                                        borderTopRightRadius: '0.5rem'
                                    }}
                                />
                            </div>
                        </PhotoView>

                        {images.slice(1).map((image, idx) => (
                            <PhotoView key={idx + 1} src={image.path}>
                                <div style={{ display: 'none' }} />
                            </PhotoView>
                        ))}
                    </PhotoProvider>
                )}

                <div className="p-3">
                    <h5 className="text-primary">{activity.title}</h5>
                    <h6 className="mb-3 text-muted">
                        {activity.place} - {activity.date}
                    </h6>
                    <hr />
                    <p dangerouslySetInnerHTML={{ __html: activity.details as string }}></p>
                </div>

                <div className="card-footer">
                    {!single && (
                        <PrimaryLink permission="activity.show" icon="eye" to={`/activities/show/${activity.id}`}>
                            Plus de détails
                        </PrimaryLink>
                    )}
                </div>
            </div>
        </div>
    );
};