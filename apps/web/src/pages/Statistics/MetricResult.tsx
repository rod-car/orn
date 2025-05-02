/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { Block, PageTitle, Spinner } from "ui";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { PrimaryLink, SurveySelector } from "@base/components";
import { StudentBySchoolZValue } from "./StudentBySchoolZValue.tsx";

export function MetricResult(): ReactNode {
    const [surveyId, setSurveyId] = useState<number>(-1)
    const { Client, datas, RequestState } = useApi<Survey>({url: 'surveys', key: 'data' })

    const getSurveys = useCallback(async () => {
        const surveys = await Client.get()
        const lastSurvey = surveys.at(-1)
        lastSurvey && setSurveyId(lastSurvey.id)
    }, [])

    useEffect(() => {
        getSurveys()
    }, [])
    
    return <>
        <PageTitle title="Résultats par métrique">
            <PrimaryLink to="/" icon="speedometer">Tableau de bord</PrimaryLink>
        </PageTitle>

        {surveyId > -1 ? <Block className="mb-3">
            <div className="mb-4">
                <SurveySelector
                    setSurveyId={setSurveyId}
                    datas={datas}
                    loading={RequestState.loading}
                    surveyId={surveyId} />
            </div>
            <StudentBySchoolZValue surveyId={surveyId === 0 ? undefined : surveyId} />
        </Block> : <Spinner isBorder className="text-center" size="sm" />}
    </>
}