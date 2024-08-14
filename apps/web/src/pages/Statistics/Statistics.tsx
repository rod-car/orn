/* eslint-disable react-hooks/exhaustive-deps */
import { Block, PageTitle } from 'ui'
import { ReactNode, useEffect, useState } from 'react'
import { scholar_years } from 'functions'
import { useApi } from 'hooks'
import { Link, SurveySelector } from '@base/components'
import { SchoolBySchoolYearClass, StudentBySchoolZ, StudentBySchoolZValue } from '@base/pages/Statistics'

export function Statistics(): ReactNode {
    const [scholarYear] = useState<string>(scholar_years().at(1) ?? '')
    const [surveyIdZ, setSurveyIdZ] = useState<number>(0)
    const [surveyId, setSurveyId] = useState<number>(0)

    const { Client, datas, RequestState } = useApi<Survey>({url: 'surveys', key: 'data' })

    useEffect(() => {
        Client.get()
    }, [])

    return (
        <>
            <PageTitle title="Statistiques">
                <Link to="/" className='btn btn-primary'><i className="bi bi-speedometer me-2"></i>Tableau de bord</Link>
            </PageTitle>

            <div className="mb-5">
                <SchoolBySchoolYearClass />
            </div>

            <Block className="mb-3">
                <h5 className="text-primary fw-semibold">Valeur de Z par métrique</h5>
                <div className="mb-4">
                    <SurveySelector
                        setSurveyId={setSurveyIdZ}
                        datas={datas}
                        loading={RequestState.loading}
                        surveyId={surveyIdZ} />
                </div>
                <StudentBySchoolZValue
                    surveyId={surveyIdZ === 0 ? undefined : surveyIdZ}
                    scholarYear={scholarYear} />
            </Block>

            <Block className="mb-4">
                <h5 className="text-primary fw-semibold">Statistique global</h5>

                <div className="mb-4">
                    <SurveySelector
                        setSurveyId={setSurveyId}
                        datas={datas}
                        loading={RequestState.loading}
                        surveyId={surveyId} />
                </div>
                <StudentBySchoolZ
                    surveyId={surveyId === 0 ? undefined : surveyId}
                    scholarYear={scholarYear} />
            </Block>
        </>
    )
}