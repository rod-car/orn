import { config } from "@/utils/config"
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
        console.log("Server error " + JSON.stringify(e))
        notFound()
    }

    return <section className="main-section">
        {activity && <div className="container">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="text-primary m-0">{activity.title}</h3>
                <h3 className="text-primary m-0">{new Date(activity.date).toLocaleDateString()}</h3>
            </div>
            <p className="mb-4 font-weight-bold">{activity.place}</p>

            {/*<p className="mt-3 mb-3" dangerouslySetInnerHTML={{ __html: activity.details as string }}></p>*/}
            <p className="text-justify">{activity.details as string}</p>

            <h6 className="mt-5">Illustrations</h6>
            <hr />

            <div className="row">
                {activity.images?.map((image, index) => <div key={index} className="col-6 mb-4">
                    <img className="w-100" src={image.path} alt={`Image ${index}`} />
                </div>)}
            </div>
        </div>}
    </section>
}