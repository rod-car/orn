import Image from "next/image.js";
import Link from "next/link.js";

export function Activity({ activity, index = 0 }: { activity: any, index?: number }) {
    const normal = index % 2 === 0;

    return <div id={activity.id} className="row">
        <div className={`col-lg-6 order-lg-${normal ? 2 : 1} p-3`}>
            <div className="activity-img">
                {/*<PhotoProvider>*/}
                    <div className="row">
                        {activity.images?.map((image: any, index: number) => <div key={index} className="col-6 mb-4" style={{cursor: "pointer"}}>
                            {/*<PhotoView key={index} src={image.path}>*/}
                                <img key={index} className="w-100" src={image.path} alt={`Image ${index}`} />
                            {/*</PhotoView>*/}
                        </div>)}
                    </div>
                {/*</PhotoProvider>*/}
            </div>
        </div>
        <div className={`col-lg-6 order-lg-${normal ? 1 : 2} p-3`}>
            <div className="activity-details">
                <h2 className="text-primary mb-2">{activity.title}</h2>
                <p className="mb-4 font-weight-bold">{activity.place} - {new Date(activity.date).toLocaleDateString()}</p>
                {/*<p className="text-justify" dangerouslySetInnerHTML={{ __html: activity.details as string }}></p>*/}
                <p className="text-justify">{activity.details as string}</p>

                <Link className="theme-btn mt-3 py-2 px-4" href={`/activites/${activity.id}`}>
                    <i className="lni lni-eye mr-3"></i>
                    Voir plus
                </Link>
            </div>
        </div>
    </div>
}