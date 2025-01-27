import { Activity } from "@/components/Activity"
import { config } from "@/utils/config"
import { Pagination } from "@/components/Pagination"

export const dynamic = 'force-dynamic'

type ActivityType = {
    meta?: {
        total: number
    }
    data: {
        images: {
            path: string
        }[],
        id: number
        title: string
        date: string
        details: string
    }[]
}

export default async function Activities({ searchParams }: { searchParams: Promise<{ page?: string, perPage?: string }> }) {
    let activities: ActivityType = { data: [] }
    const params = await searchParams

    const page = parseInt(params['page'] as string, 10) || 1;
    const perPage = parseInt(params['perPage'] as string, 10) || 5;
    let total = 10;

    try {
        const data = await fetch(`${config.apiUrl}/activities?imagesCount=4&orderField=date&orderDirection=desc&paginate=true&page=${page}&perPage=${perPage}`, {
            next: {revalidate: 1},
            cache: "no-cache"
        })

        activities = await data.json()
        if (activities.meta?.total) total = activities.meta?.total;

        console.log("Connected to server")
    } catch (e) {
        console.log("Server error " + JSON.stringify(e))
    }

    return <section id="activites" className="main-section" style={{ background: "#eff2f9" }}>
        <div className="container">
            <div className="row">
                <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                    <div className="section-title text-center mb-55">
                        <span className="wow fadeInDown" data-wow-delay=".2s">Projets</span>
                        <h2 className="wow fadeInUp" data-wow-delay=".4s">Le projet Cantine scolaire</h2>
                    </div>
                </div>
            </div>

            {activities.data.length === 0 && <p className="text-center">Aucune donnees</p>}

            {activities.data.map((activity, index: number) => {
                return <div className="bg-white shadow p-5 mb-5 rounded-md" key={activity.id}>
                    <Activity key={activity.id} index={index} activity={activity} />
                </div>
            })}

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