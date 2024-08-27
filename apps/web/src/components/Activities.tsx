import { ReactNode } from "react"
import { ActivityLoading, PrimaryLink } from "@base/components"
import { Block } from "ui"
import { range } from "functions"
import { PhotoProvider, PhotoView } from "react-photo-view"
import 'react-photo-view/dist/react-photo-view.css';

export const Loading = ({count = 4}: {count?: number}) => {
    return range(count).map(index => <div key={index} className="mb-4"><ActivityLoading reverse={index % 2 === 0} /></div>)
}

export const ActivityBlock = ({activity, index, single = false}: {activity: Activity, index: number, single?: boolean}): ReactNode => {
    return <Block className="mb-4" key={activity.id}>
        <div className={`d-flex justify-content-between ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
            <div className={`w-50 ${index % 2 !== 0 ? '' : 'me-4'}`}>
                <h5 className="text-primary">{activity.title}</h5>
                <h6 className="mb-3 fst-italic">{activity.place} - {activity.date}</h6>
                <hr />

                <p dangerouslySetInnerHTML={{ __html: activity.details as string }}></p>

                {!single && <PrimaryLink icon="eye" className="mt-5" to={`/activities/show/${activity.id}`}>Plus de détails</PrimaryLink>}
            </div>
            <div className={`w-50 ${index % 2 !== 0 ? 'me-4' : ''}`}>
                {/*<div className="row">
                    {activity.images?.map(image => <img className="col-6 mb-4" src={image.path} alt={`Image ${index}`} />)}
                </div>*/}
                <PhotoProvider>
                    <div className="row">
                        {activity.images?.map((image, index) => <div className="col-6 mb-4" style={{cursor: "pointer"}}>
                            <PhotoView key={index} src={image.path}>
                                <img className="w-100" src={image.path} alt={`Image ${index}`} />
                            </PhotoView>
                        </div>)}
                    </div>
                </PhotoProvider>
            </div>
        </div>
    </Block>
}