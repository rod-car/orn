import './Input.module.scss'

import { ChangeEvent, useId } from "react"
import { RequiredSign } from '../RequiredSign/RequiredSign'
import { AutoSign } from '../AutoSign/AutoSign'

type InputProps = React.ComponentProps<"input"> & {
    label?: string;
    required?: boolean;
    elementSize?: ElementSize;
    controlled?: boolean;
    auto?: boolean;
    error?: string[];
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
    type = 'text',
    required = true,
    elementSize = "md",
    controlled = false,
    className,
    auto = false,
    error = undefined,
    ...props
}: InputProps) {
    const id = useId()
    if (auto) props.disabled = true

    return <div className={`form-group ${className}`}>
        {props.label && <label className="form-label" htmlFor={id}>
            {props.label}
            {auto === false && <RequiredSign value={required} />}
            <AutoSign value={auto} />
        </label>}
        <input
            id={id}
            type={type}
            name={props.name}
            value={controlled ? props.value : undefined}
            onChange={controlled ? props.onChange : () => { }}
            placeholder={props.placeholder}
            className={`form-control input-${elementSize}`}
            {...props}
        />
        {error && error.length > 0 && <span className="text-danger d-block mt-1">{error.at(0)}</span>}
    </div>
}