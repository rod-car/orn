import { useApi } from 'hooks'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { config, getToken } from '../../config'
import { Button, HomeCard, Spinner } from 'ui'
import { SchoolsByClasses, SchoolsByScholarYear, ZBySchool } from '../pages'
import { NavLink } from 'react-router-dom'
import { Link } from '@renderer/components'
import { getPdf } from '@renderer/utils'

import './Home.modules.scss'

export function Home(): React.ReactElement {
    const { Client: StudentClient, datas: studentCount } = useApi<Student>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students',
        key: 'data'
    })

    const { Client: SchoolClient, datas: schoolCount } = useApi<School>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/schools',
        key: 'data'
    })

    const { Client: SurveyClient, datas: surveyCount } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/surveys',
        key: 'data'
    })

    const [loaded, setLoaded] = useState(false)

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

    const exportPdf = useCallback(async () => {
        getPdf({ fileName: 'Statistiques.pdf', title: 'Statistiques' })
    }, [])

    return (
        <>
            <div className="mb-5 d-flex justify-content-between align-items-center">
                <h2>Tableau de bord</h2>
                <Link to="/states" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>États
                </Link>
            </div>

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
                        title="Mésures antrhopo"
                        icon="bar-chart"
                        type="success"
                        value={'count' in surveyCount ? surveyCount.count : <Spinner />}
                    />
                </NavLink>
            </div>

            <Button onClick={exportPdf} icon="file" className="btn secondary-link mb-4">
                Exporter tous vers PDF
            </Button>

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

            <div className="row mb-5">
                <div className="col-12">{loaded ? <ZBySchool /> : <Spinner />}</div>
            </div>
        </>
    )
}
