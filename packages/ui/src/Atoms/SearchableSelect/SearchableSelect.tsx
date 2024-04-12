import "./style.css"
import SelectSearch, { SelectSearchProps } from 'react-select-search'

export function SearchableSelect(props: SelectSearchProps) {
    return <SelectSearch {...props} />
}