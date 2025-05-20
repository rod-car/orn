import Image from "next/image.js";
import Link from "next/link.js";

export function Activity({ activity, index = 0 }: { activity: any, index?: number }) {
    const normal = index % 2 === 0;

    return <div id={activity.id} className="row">
                <div className={`col-12 p-3`}>
            <div className="activity-details">
                <h2 className="text-primary mb-2">{activity.title}</h2>
                <p className="mb-4 font-weight-bold">{activity.place} - {new Date(activity.date).toLocaleDateString('fr-FR')}</p>
                <div style={{wordBreak: 'break-word'}} className="text-justify details" dangerouslySetInnerHTML={{ __html: activity.details as string }}></div>

                <Link className="theme-btn mt-3 py-2 px-4" href={`/activites/${activity.id}`}>
                    <i className="lni lni-eye mr-3"></i>
                    Voir plus
                </Link>
            </div>
        </div>
        <div className={`col-12 p-3`}>
            <div className="activity-img">
                <div className="row">
                    {activity.images?.map((image: any, index: number) => <div key={index} className="col-6 mb-4" style={{cursor: "pointer"}}>
                        <Image key={index} width={1920} height={1920} objectFit="cover" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAIAAABxZ0isAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAoUlEQVR4nAGWAGn/AKDH1KTH52Njbq/CkHKUPW+LSHibVWmTJgCPjWSTkWd2gUxpe0xvg0I3QiY5PR9hcjkAzMu7uqqYl4d3fGVQYFc7dnRMOTIgKiQWAObGq5Z6dqmYn+LVwNy+lMmLbTAhGxkAAACZkJBVOT18ZFzMtZuVdlhlTjZ1bV3GwLUAYoOWrZBw76CI3aSMfJRJZIY99f/i8vTnKsZHqI+4HPYAAAAASUVORK5CYII=" className="w-100 h-100" style={{objectFit: 'cover'}} src={image.path} alt={`Image ${index}`} />
                    </div>)}
                </div>
            </div>
        </div>
    </div>
}