/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { config } from '@base/config'
import { Spinner } from 'ui'
import { SchoolsByClassesChart, SchoolsByScholarYearChart } from '@base/charts'
import { AppCard, CardState, Link } from '@base/components'

import './HomePage.modules.scss'
import { useConfigStore } from '@base/hooks';

export function HomePage(): ReactNode {
    const { Client: StudentClient, datas: studentCount } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students',
        key: 'data'
    })

    const { Client: SchoolClient, datas: schoolCount } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const { Client: SurveyClient, datas: surveyCount } = useApi<Survey>({
        baseUrl: config.baseUrl,
        url: '/surveys',
        key: 'data'
    })

    const [_loaded, setLoaded] = useState(false)
    const { firstTime } = useConfigStore();

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
            <div className="mb-5 d-flex justify-content-between align-items-center">
                <h2>Tableau de bord</h2>
                <Link to="/anthropo-measure/statistics" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Statistiques
                </Link>
            </div>

            {firstTime && <AppCard title="Bienvenu" content="Bienvenue sur la plateforme ORN. Nous vous souhaitons une bonne navigation." actionLabel="Voir les tutoriels" actionUrl="/help" icon="question" />}

            <div className="row mb-5">
                <div className="col-4">
                    <CardState
                        title="Etudiants"
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
                        title="Mésures antrhopo"
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
