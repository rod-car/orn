/* eslint-disable react-hooks/exhaustive-deps */
import { scholar_years } from "functions";
import { useApi } from "hooks";
import { Dispatch, SetStateAction, ReactNode, ChangeEvent, useCallback, useEffect } from "react";
import { Select } from "ui";

type ScholarYearSelectorProps = {
    label?: string;
    scholarYear: number | string;
    setScholarYear: Dispatch<SetStateAction<number | string>>,
    disabled?: boolean
}

export function ScholarYearSelector({label = "Année scolaire", scholarYear, setScholarYear}: ScholarYearSelectorProps): ReactNode {
    return <Select
        options={scholar_years()}
        value={scholarYear}
        onChange={({target}) => setScholarYear(target.value)}
        label={label}
        placeholder="Selectionner"
        controlled
    />
}


export function ScholarYearSelectorServer({
    label = "Année scolaire",
    scholarYear,
    setScholarYear,
    disabled = false
}: ScholarYearSelectorProps): ReactNode {
    const { Client, RequestState, datas: scholarYears } = useApi<Survey>({
        url: '/scholar-years'
    })

    useEffect(() => {
        Client.get()
    }, [])

    const handleChange = useCallback(({target: { value }}: ChangeEvent<HTMLSelectElement>) => {
        setScholarYear && setScholarYear(parseInt(value))
    }, [setScholarYear]);

    return <Select
        options={scholarYears}
        disabled={disabled}
        value={scholarYear}
        onChange={handleChange}
        label={label}
        loading={RequestState.loading}
        placeholder="Selectionner"
        controlled
    />
}