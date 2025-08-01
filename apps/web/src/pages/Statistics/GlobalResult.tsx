/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryLink, SurveySelector } from "@base/components";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Block, PageTitle, Spinner } from "ui";
import { StudentBySchoolZ } from "./StudentBySchoolZ.tsx";
import { useApi } from "hooks";

export function GlobalResult(): ReactNode {
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
        <PageTitle title="Résultats global">
            <PrimaryLink permission="dashboard.view" to="/" icon="speedometer">Tableau de bord</PrimaryLink>
        </PageTitle>

        {surveyId > -1 ? <Block className="mb-4">
            <div className="mb-4">
                <SurveySelector
                    setSurveyId={setSurveyId}
                    datas={datas}
                    loading={RequestState.loading}
                    surveyId={surveyId} />
            </div>
            <StudentBySchoolZ surveyId={surveyId === 0 ? undefined : surveyId} />
        </Block> : <Spinner isBorder className="text-center" size="sm" />}
    </>
}