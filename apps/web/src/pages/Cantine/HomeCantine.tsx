import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect } from 'react'
import { config } from '@renderer/config'
import { Block, HomeCard, Spinner } from 'ui'
import { NavLink } from 'react-router-dom'
import { Link } from '@renderer/components'

import './HomeCantine.modules.scss'

export function HomeCantine(): ReactNode {
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

    const getCount = useCallback(async () => {
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
            <div className="mb-5 d-flex justify-content-between align-items-center">
                <h2>Tableau de bord</h2>
                <Link to="/cantine/statistics" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Statistiques
                </Link>
            </div>

            <div className="row mb-5">
                <NavLink to="/cantine/student/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Étudiant nouris"
                        icon="users"
                        type="primary"
                        value={'count' in studentCount ? studentCount.count : <Spinner />}
                    />
                </NavLink>

                <NavLink to="/anthropo-measure/school/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Écoles asservi"
                        icon="home"
                        type="danger"
                        value={'count' in schoolCount ? schoolCount.count : <Spinner />}
                    />
                </NavLink>

                <NavLink to="/anthropo-measure/survey/list" className="col-4 clickable-card">
                    <HomeCard
                        title="Répas servis"
                        icon="bar-chart"
                        type="success"
                        value={'count' in surveyCount ? surveyCount.count : <Spinner />}
                    />
                </NavLink>
            </div>

            <Block>
                <h3 className="mb-5">Ici les tableaux des données</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur officiis distinctio assumenda magni nesciunt, dolorum praesentium modi nostrum numquam ipsam quibusdam illo quasi. Eius quod officiis dolorum ut. Corrupti, ducimus.</p>
            </Block>
        </>
    )
}
