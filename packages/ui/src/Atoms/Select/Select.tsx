import { ChangeEvent, useId } from "react"
import { RequiredSign } from "../RequiredSign/RequiredSign"

type Option = Partial<{
    id: string | number
    label: string | number
    name: string | number,
    phase: number
}>

type SelectProps = {
    label?: string;
    required?: boolean;
    defaultOption?: string | number;
    name?: string;
    controlled?: boolean;
    value?: string | number;
    options: Option[] | Array<string | number>,
    config?: {
        optionKey: keyof Option,
        valueKey: keyof Option
    }
    placeholder?: string | null
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({ label, name, value, options, defaultOption, onChange, controlled = false, required = true, config = { optionKey: 'id', valueKey: 'label' }, placeholder = "Selectionner un option" }: SelectProps) {
    const id = useId()
    
    return <div className="form-group">
        {label && <label className="form-label" htmlFor={id}>
            {label}
            <RequiredSign value={required} />
        </label>}
        <select value={value} defaultValue={defaultOption} onChange={controlled ? onChange : () => { }} name={name} id={id} className="form-select">
            {placeholder && <option value={undefined}>{placeholder}</option>}
            {options && options.map(o => typeof o === 'object'
                ? <option key={o[config.optionKey]} value={o[config.optionKey]}>{o[config.valueKey]}</option>
                : <option key={o} value={o}>{o}</option>
            )}
        </select>
    </div>
}