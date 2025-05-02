import { Dispatch, SetStateAction, ReactNode } from "react";
import { Select } from "ui";

type SurveySelectorProps = {
    datas: Survey[];
    surveyId: number;
    setSurveyId: Dispatch<SetStateAction<number>>;
    loading?: boolean;
}

export function SurveySelector({datas, surveyId, setSurveyId, loading}: SurveySelectorProps): ReactNode {
    return <Select
        options={datas}
        config={{optionKey: 'id', valueKey: 'label'}}
        value={surveyId}
        onChange={({target}) => setSurveyId(parseInt(target.value))}
        label="Mésure"
        placeholder="Tous"
        loading={loading}
        controlled
    />
}