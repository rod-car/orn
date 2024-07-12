/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { config } from '@base/config'
import { HomeCard, Spinner } from 'ui'
import { SchoolsByClasses } from '..'
import { NavLink } from 'react-router-dom'
import { AppCard, CardState, Link } from '@base/components'

import './HomePage.modules.scss'

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

    const getCount = useCallback(async () => {
        const option = { count: 1 }
        await StudentClient.get(option)
        await SchoolClient.get(option)
        await SurveyClient.get(option)
        setLoaded(true)
    }, [])

    useEffect(() => {
        getCount()
    }, [])

    return (
        <>
            <div className="mb-5 d-flex justify-content-between align-items-center">
                <h2>Tableau de bord</h2>
                <Link to="/anthropo-measure/statistics" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Statistiques
                </Link>
            </div>

            <AppCard title="Bienvenu" content="Bienvenue sur la plateforme ORN. Nous vous souhaitons une bonne navigation." actionLabel="Voir les tutoriels" actionUrl="/help" icon="question" />

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
                    <SchoolsByClasses />
                </div>
            </div>
        </>
    )
}
