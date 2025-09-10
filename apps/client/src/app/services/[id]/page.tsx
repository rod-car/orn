import { Activity } from "@/components/Activity"
import { Pagination } from "@/components/Pagination"
import { RecapComponent } from "@/components/RecapComponent"
import { config } from "@/utils/config"
import { notFound } from "next/navigation"
import { RecapConso } from "@/components/RecapConso"

type ActivityType = {
    data: {
        images: {
            path: string
        }[],
        id: number
        title: string
        date: string
        details: string
    }[],
    total: number
}

type ServiceType = {
    id: number
    title: string
    description: string
    icon: string
    link: string
}

export default async function Activities({ searchParams, params }: { searchParams: Promise<{ page?: string, perPage?: string, id: number }>, params: Promise<{ id: number }> }) {
    let service: ServiceType | undefined = undefined
    let recap: any = undefined
    let activities: ActivityType = {
        data: [],
        total: 0
    }

    const queryParams = await searchParams

    const id = (await params).id

    const page = parseInt(queryParams['page'] as string, 10) || 1;
    const perPage = parseInt(queryParams['perPage'] as string, 10) || 5;
    let total = 0;

    try {
        const url = `${config.apiUrl}/services/${id}?imagesCount=4&orderField=date&orderDirection=desc&paginate=true&page=${page}&perPage=${perPage}`
        const response = await fetch(url, {
            next: { revalidate: 1 },
            cache: "no-cache"
        })

        const jsonData = (await response.json()).data

        activities = jsonData.activities
        service = jsonData.service
        recap = jsonData.recap

        if (activities?.total) total = activities?.total;
    } catch (e) {
        notFound()
    }

    return <section id="activites" className="main-section" style={{ background: "#eff2f9" }}>
        <div className="container">
            {service && <>
                <div className="row">
                    <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center">
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">{service.title}</h2>
                        </div>
                    </div>
                </div>

                {recap && <RecapComponent recap={recap} />}
                {id == 1 && <RecapConso />}

                <h5 className="mb-4 text-primary text-center text-uppercase fw-bold">Historiques des activités</h5>
                {activities?.data && activities?.data?.map((activity, index: number) => {
                    return <div className="bg-white shadow p-5 mb-5 rounded-md" key={activity.id}>
                        <Activity key={activity.id} index={index} activity={activity} />
                    </div>
                })}
            </>}

            {(!activities || activities && activities.data.length === 0) && <p className="text-center">Aucune activités</p>}

            <Pagination
                hasNextPage={page * perPage < total}
                hasPrevPage={page > 1}
                currentPage={page}
                perPage={perPage}
                totalPages={total}
            />
        </div>
    </section>
}