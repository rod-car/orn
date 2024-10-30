/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { PageTitle, Spinner } from 'ui'
import { SchoolsByClassesChart, SchoolsByScholarYearChart } from '@base/charts'
import { CardState, Link } from '@base/components'

import './HomePage.modules.scss'
import { scholar_years } from 'functions'

/**
 * Description placeholder
 *
 * @export
 * @returns {ReactNode}
 */
export function HomePage(): ReactNode {
    const [scholarYear] = useState<string>(scholar_years().at(0) as string)

    const { Client: StudentClient, datas: studentCount } = useApi<Student>({
        url: '/students',
        key: 'data'
    })

    const { Client: SchoolClient, datas: schoolCount } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: SurveyClient, datas: surveyCount } = useApi<Survey>({
        url: '/surveys',
        key: 'data'
    })

    const [_loaded, setLoaded] = useState(false)

    const getCount = useCallback(async () => {
        const option = { count: 1 }
        StudentClient.get(option)
        SchoolClient.get(option)
        SurveyClient.get(option)
        setLoaded(true)
    }, [])

    useEffect(() => {
        getCount()
    }, [])

    return (
        <>
            <PageTitle title="Tableau de bord" />

            <div className="row mb-5">
                <div className="col-4">
                    <CardState
                        title={`Étudiants (${scholarYear})`}
                        link="/anthropo-measure/student/list"
                        value={'count' in studentCount ? studentCount.count as number : <Spinner />} 
                    />
                </div>

                <div className="col-4">
                    <CardState
                        title="Écoles"
                        link="/anthropo-measure/school/list"
                        value={'count' in schoolCount ? schoolCount.count as number : <Spinner />} 
                    />
                </div>

                <div className="col-4">
                    <CardState
                        title="Mesures anthropométrique"
                        link="/anthropo-measure/survey/list"
                        value={'count' in surveyCount ? surveyCount.count as number : <Spinner />} 
                    />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-12">
                    <SchoolsByClassesChart />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-12">
                    <SchoolsByScholarYearChart />
                </div>
            </div>
        </>
    )
}
