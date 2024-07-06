import { Dispatch, SetStateAction, ReactNode } from "react";
import { Select } from "ui";

export function ClassSelector({label = "Classe", datas, classId, setClassId, loading}: {label?: string, datas: Classes[], classId: number, setClassId: Dispatch<SetStateAction<number>>, loading?: boolean}): ReactNode {
    return <Select
        options={datas}
        config={{optionKey: 'id', valueKey: 'name'}}
        value={classId}
        onChange={({target}) => setClassId(parseInt(target.value))}
        label={label}
        placeholder="Selectionner"
        loading={loading}
        controlled
    />
}