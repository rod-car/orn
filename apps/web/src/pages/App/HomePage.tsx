import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { config } from '@renderer/config'
import { HomeCard, Spinner } from 'ui'
import { SchoolsByClasses } from '..'
import { NavLink } from 'react-router-dom'
import { Link } from '@renderer/components'

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

            <div className="row mb-5">
                <NavLink to="/anthropo-measure/student/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Étudiant"
                        icon="users"
                        type="primary"
                        value={'count' in studentCount ? studentCount.count : <Spinner />}
                    />
                </NavLink>

                <NavLink to="/anthropo-measure/school/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Écoles"
                        icon="home"
                        type="danger"
                        value={'count' in schoolCount ? schoolCount.count : <Spinner />}
                    />
                </NavLink>

                <NavLink to="/anthropo-measure/survey/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Mésures antrhopo"
                        icon="bar-chart"
                        type="success"
                        value={'count' in surveyCount ? surveyCount.count : <Spinner />}
                    />
                </NavLink>
            </div>

            <div className="row mb-5">
                <div className="col-12">
                    <SchoolsByClasses />
                </div>
            </div>
        </>
    )
}
