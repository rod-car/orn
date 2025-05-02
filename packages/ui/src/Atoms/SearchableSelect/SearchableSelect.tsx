import "./style.css"
import SelectSearch, { SelectSearchProps, SelectedOption, type SelectedOptionValue } from 'react-select-search'

export type Option = SelectedOption;
export type Value = SelectedOptionValue;

export function SearchableSelect(props: SelectSearchProps) {
    return <SelectSearch {...props} />
}