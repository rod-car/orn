import { Activity } from "@/components/Activity"
import { config } from "@/utils/config"

export const dynamic = 'force-dynamic'

export default async function Activities(/*{ searchParams }: { searchParams: { page?: string } }*/) {
    let activities: ActivityType = { data: [] }

    try {
        const data = await fetch(config.apiUrl + '/activities?imagesCount=4&orderField=date&orderDirection=desc', {
            next: {revalidate: 1}
        })
        activities = await data.json()
        console.log("Connected to server")
    } catch (e) {
        console.log("Server error " + JSON.stringify(e))
    }

    return <section id="activites" className="main-section" style={{ background: "#eff2f9" }}>
        <div className="container">
            <div className="row">
                <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                    <div className="section-title text-center mb-55">
                        <span className="wow fadeInDown" data-wow-delay=".2s">Activités</span>
                        <h2 className="wow fadeInUp" data-wow-delay=".4s">Tous les activites</h2>
                    </div>
                </div>
            </div>

            {activities.data.length === 0 && <p className="text-center">Aucune donnees</p>}

            {activities.data.map((activity, index: number) => {
                return <div className="bg-white shadow p-5 mb-5 rounded-md" key={activity.id}>
                    <Activity key={activity.id} index={index} activity={activity} />
                </div>
            })}
        </div>
    </section>
}