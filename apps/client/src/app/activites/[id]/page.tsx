import { config } from "@/utils/config"
import Image from "next/image.js"
import { notFound } from "next/navigation.js"

export default async function Page({ params }: {
    params: Promise<{ id: number }>
}) {
    let activity: {
        images: {
            path: string
        }[],
        title: string
        date: string
        details: string
        place: string
    } | null = null
    const id = (await params).id

    try {
        const data = await fetch(`${config.apiUrl}/activities/${id}`, {
            next: {
                revalidate: 1
            }
        })
        activity = await data.json()
    } catch (e) {
        notFound()
    }

    return <section className="main-section">
        {activity && <div className="container">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="text-primary m-0">{activity.title}</h3>
                <h3 className="text-primary m-0">{new Date(activity.date).toLocaleDateString()}</h3>
            </div>
            <p className="mb-4 font-weight-bold">{activity.place}</p>

            <div className="mt-3 mb-3" dangerouslySetInnerHTML={{ __html: activity.details as string }}></div>

            <h6 className="mt-5">Illustrations</h6>
            <hr />

            <div className="row">
                {activity.images?.map((image, index) => <div key={index} className="col-6 mb-4">
                    <Image width={1920} height={1920} objectFit="cover" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAIAAABxZ0isAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAoUlEQVR4nAGWAGn/AKDH1KTH52Njbq/CkHKUPW+LSHibVWmTJgCPjWSTkWd2gUxpe0xvg0I3QiY5PR9hcjkAzMu7uqqYl4d3fGVQYFc7dnRMOTIgKiQWAObGq5Z6dqmYn+LVwNy+lMmLbTAhGxkAAACZkJBVOT18ZFzMtZuVdlhlTjZ1bV3GwLUAYoOWrZBw76CI3aSMfJRJZIY99f/i8vTnKsZHqI+4HPYAAAAASUVORK5CYII=" className="w-100 h-auto" src={image.path} alt={`Image ${index}`} />
                </div>)}
            </div>
        </div>}
    </section>
}