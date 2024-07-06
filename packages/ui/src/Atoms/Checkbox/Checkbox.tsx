import { ChangeEvent, useId } from "react"

type CheckboxProps = {
    label?: string;
    name?: string;
    checked: boolean;
    mode?: ElementMode;
    className?: string;
    onCheck?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox ({ label, name, onCheck, checked, className = '', mode = "default" }: CheckboxProps) {
    const id = useId()
    return <div className={`form-group d-inline-flex align-items-center ${className}`}>
        <input 
            id={id}
            name={name} 
            type='checkbox' 
            checked={checked} 
            onChange={onCheck}
            className={`form-check-input bg-${mode}`}
        />
        <label className="form-check-label ms-2" htmlFor={id}>{label}</label>
    </div>
}