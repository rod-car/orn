import { useApi } from 'hooks'
import React, { useCallback, useEffect } from 'react'
import { config } from '../../config'
import { HomeCard, Spinner } from 'ui'
import { SchoolsByClasses, SchoolsByScholarYear, ZBySchool } from '../pages'
import { NavLink } from 'react-router-dom'

import './Home.modules.scss'

export function Home(): React.ReactElement {
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

    const getCount = useCallback(() => {
        const option = { count: 1 }
        StudentClient.get(option)
        SchoolClient.get(option)
        SurveyClient.get(option)
    }, [])

    useEffect(() => {
        getCount()
    }, [])

    return (
        <>
            <h1 className="mb-5">Dashboard</h1>

            <div className="row mb-5">
                <NavLink to="/student/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Étudiant"
                        icon="users"
                        type="primary"
                        value={'count' in studentCount ? studentCount.count : <Spinner />}
                    />
                </NavLink>

                <NavLink to="/school/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Écoles"
                        icon="home"
                        type="danger"
                        value={'count' in schoolCount ? schoolCount.count : <Spinner />}
                    />
                </NavLink>

                <NavLink to="/survey/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Enquêtes"
                        icon="bar-chart"
                        type="success"
                        value={'count' in surveyCount ? surveyCount.count : <Spinner />}
                    />
                </NavLink>
            </div>

            <div className="row mb-5">
                <div className="col-12">
                    <ZBySchool />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-12">
                    <SchoolsByClasses />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-12">
                    <SchoolsByScholarYear />
                </div>
            </div>
        </>
    )
}
