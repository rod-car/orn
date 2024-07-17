import { Dispatch, SetStateAction, ReactNode } from "react";
import { Select } from "ui";

export function SurveySelector({datas, surveyId, setSurveyId, loading}: {datas: Survey[], surveyId: number, setSurveyId: Dispatch<SetStateAction<number>>, loading?: boolean}): ReactNode {
    return <Select
        options={datas}
        config={{optionKey: 'id', valueKey: 'phase'}}
        value={surveyId}
        onChange={({target}) => setSurveyId(parseInt(target.value))}
        label="Phase d'enquête"
        placeholder="Tous"
        loading={loading}
        controlled
    />
}