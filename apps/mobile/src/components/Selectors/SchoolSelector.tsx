import { Dispatch, SetStateAction, ReactNode } from "react";
import { Select } from "ui";

export function SchoolSelector({datas, schoolId, setSchoolId, loading}: {datas: School[], schoolId: number, setSchoolId: Dispatch<SetStateAction<number>>, loading?: boolean}): ReactNode {
    return <Select
        options={datas}
        config={{optionKey: 'id', valueKey: 'name'}}
        value={schoolId}
        onChange={({target}) => setSchoolId(parseInt(target.value))}
        label="Établissement"
        placeholder="Sélectionner"
        loading={loading}
        controlled
    />
}