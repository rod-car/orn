import { Block } from 'ui'
import { SchoolBySchoolYearClass } from './SchoolBySchoolYearClass'
import { StudentBySchoolZ } from './StudentBySchoolZ'
import { useEffect, useState } from 'react'
import { scholar_years } from 'functions'
import { StudentBySchoolZValue } from './StudentBySchoolZValue'
import { useApi } from 'hooks'
import { SurveySelector } from '@renderer/components'

export function State(): JSX.Element {
    const [scholarYear, _setScholarYear] = useState<string>(scholar_years().at(1) ?? '')
    const [surveyIdZ, setSurveyIdZ] = useState<number>(0)
    const [surveyId, setSurveyId] = useState<number>(0)

    const { Client, datas, RequestState } = useApi<Survey>({url: 'surveys', key: 'data' })

    useEffect(() => {
        Client.get()
    }, [])

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-5">
                <h2>Statistiques</h2>
            </div>

            <div className="mb-5">
                <SchoolBySchoolYearClass />
            </div>

            <Block className="mb-5">
                <div className="mb-5">
                    <h2 className="text-primary fw-semibold">Valeur de Z par type de métriques</h2>
                </div>

                <div className="mb-5">
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

            <Block className="mb-5">
                <div className="mb-5">
                    <h2 className="text-primary fw-semibold">Statistique de la mal nutrition</h2>
                </div>

                <div className="mb-5">
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