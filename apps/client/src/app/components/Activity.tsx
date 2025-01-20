import Image from "next/image.js";
import Link from "next/link.js";

export function Activity({ activity, index = 0 }: { activity: any, index?: number }) {
    const normal = index % 2 === 0;

    return <div id={activity.id} className="row mt-5 pb-5">
        <div className={`col-lg-6 order-lg-${normal ? 2 : 1}`}>
            <div className="activity-img mb-4">
                {/*<PhotoProvider>*/}
                    <div className="row">
                        {activity.images?.map((image: any, index: number) => <div key={index} className="col-6 mb-4" style={{cursor: "pointer"}}>
                            {/*<PhotoView key={index} src={image.path}>*/}
                                <Image key={index} className="w-100" src={image.path} alt={`Image ${index}`} />
                            {/*</PhotoView>*/}
                        </div>)}
                    </div>
                {/*</PhotoProvider>*/}
            </div>
        </div>
        <div className={`col-lg-6 order-lg-${normal ? 1 : 2} pr-5`}>
            <div className="activity-details">
                <h4 className="mb-2">{activity.title}</h4>
                <p className="mb-4 font-weight-bold">{activity.place} - {activity.date}</p>
                <p className="text-justify" dangerouslySetInnerHTML={{ __html: activity.details as string }}></p>

                <Link className="btn btn-primary mt-3" href={`/activites/${activity.id}`}>
                    Voir plus de details
                </Link>
            </div>
        </div>
    </div>
}