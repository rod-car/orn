/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryLink, SurveySelector } from "@base/components";
import { ReactNode, useEffect, useState } from "react";
import { Block, PageTitle } from "ui";
import { StudentBySchoolZValue } from "./StudentBySchoolZValue.tsx";
import { useApi } from "hooks";

export function MetricResult(): ReactNode {
    const [surveyId, setSurveyId] = useState<number>(1)
    const { Client, datas, RequestState } = useApi<Survey>({url: 'surveys', key: 'data' })

    useEffect(() => {
        Client.get()
    }, [])
    
    return <>
        <PageTitle title="Résultats par métrique">
            <PrimaryLink to="/" icon="speedometer">Tableau de bord</PrimaryLink>
        </PageTitle>

        {<Block className="mb-3">
            <div className="mb-4">
                <SurveySelector
                    setSurveyId={setSurveyId}
                    datas={datas}
                    loading={RequestState.loading}
                    surveyId={surveyId} />
            </div>
            <StudentBySchoolZValue surveyId={surveyId === 0 ? undefined : surveyId} />
        </Block>}
    </>
}