import { scholar_years } from "functions";
import { Dispatch, SetStateAction, ReactNode } from "react";
import { Select } from "ui";

export function ScholarYearSelector({label = "Année scolaire", scholarYear, setScholarYear}: {label?: string, scholarYear: string, setScholarYear: Dispatch<SetStateAction<string>>}): ReactNode {
    return <Select
        options={scholar_years()}
        value={scholarYear}
        onChange={({target}) => setScholarYear(target.value)}
        label={label}
        placeholder="Selectionner"
        controlled
    />
}