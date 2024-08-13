import { ChangeEvent, CSSProperties, useId } from "react"
import { RequiredSign } from "../RequiredSign/RequiredSign"

type Option = Partial<{
    id: string | number
    label: string | number
    name: string | number,
    designation: string,
    phase: number,
    title: string
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
    error?: string[]
    loading?: boolean
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({ label, name, value, options, defaultOption, onChange, controlled = false, required = true, config = { optionKey: 'id', valueKey: 'label' }, placeholder = "Selectionner un option", error = undefined, loading = false }: SelectProps) {
    const id = useId()

    return <div className="form-group">
        {label && <label style={styles.small} className="form-label fw-semibold" htmlFor={id}>
            {label}
            <RequiredSign value={required} />
        </label>}
        {loading ? <p style={styles.small} className="form-select bg-grey m-0">Chargement des données</p> :
            <select style={styles.small} value={value} defaultValue={defaultOption} onChange={controlled ? onChange : () => { }} name={name} id={id} className="form-select shadow-sm">
                {placeholder && <option value={0}>{placeholder}</option>}
                {options && options.map(o => typeof o === 'object'
                    ? <option key={o[config.optionKey]} value={o[config.optionKey]}>{o[config.valueKey]}</option>
                    : <option key={o} value={o}>{o}</option>
                )}
            </select>}
        {error && error.length > 0 && <span style={styles.small} className="text-danger d-block mt-1">{error.at(0)}</span>}
    </div>
}

const styles: Record<string, CSSProperties> = {
    small: {
        fontSize: 'small'
    }
}