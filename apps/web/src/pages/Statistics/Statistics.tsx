/* eslint-disable react-hooks/exhaustive-deps */
import { Block, PageTitle } from 'ui'
import { ReactNode, useEffect, useState } from 'react'
import { useApi } from 'hooks'
import { PrimaryLink, SurveySelector } from '@base/components'
import { SchoolBySchoolYearClass, StudentBySchoolZ, StudentBySchoolZValue } from '@base/pages/Statistics'

export function Statistics(): ReactNode {
    const [surveyIdZ, setSurveyIdZ] = useState<number>(1)
    const [surveyId, setSurveyId] = useState<number>(1)

    const { Client, datas, RequestState } = useApi<Survey>({url: 'surveys', key: 'data' })

    useEffect(() => {
        Client.get()
    }, [])

    return (
        <>
            <PageTitle title="Statistiques">
                <PrimaryLink to="/" icon="speedometer">Tableau de bord</PrimaryLink>
            </PageTitle>

            <div className="mb-4">
                <SchoolBySchoolYearClass />
            </div>

            {<Block className="mb-3">
                <h5 className="text-primary fw-semibold">Valeur de Z par métrique</h5>
                <div className="mb-4">
                    <SurveySelector
                        setSurveyId={setSurveyIdZ}
                        datas={datas}
                        loading={RequestState.loading}
                        surveyId={surveyIdZ} />
                </div>
                <StudentBySchoolZValue surveyId={surveyIdZ === 0 ? undefined : surveyIdZ} />
            </Block>}

            <Block className="mb-4">
                <h5 className="text-primary fw-semibold">Statistique global</h5>

                <div className="mb-4">
                    <SurveySelector
                        setSurveyId={setSurveyId}
                        datas={datas}
                        loading={RequestState.loading}
                        surveyId={surveyId} />
                </div>
                <StudentBySchoolZ surveyId={surveyId === 0 ? undefined : surveyId} />
            </Block>
        </>
    )
}