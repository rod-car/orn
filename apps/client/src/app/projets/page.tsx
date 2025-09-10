import { Activity } from "@/components/Activity"
import { config } from "@/utils/config"

export const dynamic = 'force-dynamic'

export default async function Projets() {
    /*let activities: {
        data: {
            images: {
                path: string
            }[],
            id: number
            title: string
            date: string
            details: string
        }[]
    } = { data: [] }
    try {
        const data = await fetch(config.apiUrl + '/activities?imagesCount=4&orderField=date&orderDirection=desc', {
            next: {revalidate: 1}
        })
        activities = await data.json()
    } catch (e) {
    }*/

    return <section id="activites" className="main-section">
        <div className="container">
            <div className="row">
                <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                    <div className="section-title text-center mb-55">
                        <span className="wow fadeInDown" data-wow-delay=".2s">Projets</span>
                        <h2 className="wow fadeInUp" data-wow-delay=".4s">Tous les projets</h2>
                    </div>
                </div>
            </div>
        </div>
    </section>
}