import { ChangeEvent, useId } from "react"

import './Textarea.module.scss'
import { RequiredSign } from "../RequiredSign/RequiredSign";

type TextareaProps = {
    label?: string;
    required?: boolean;
    controlled?: boolean;
    rows?: number;
    cols?: number;
    name?: string;
    value?: string | number;
    error?: string[];
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({ label, onChange, controlled = true, required = true, error = undefined, ...props }: TextareaProps) {
    const id = useId()

    return <div className="form-group">
        {label && <label className="form-label" htmlFor={id}>
            {label}
            <RequiredSign value={required} />
        </label>}
        <textarea
            id={id}
            value={controlled ? props.value : undefined}
            onChange={controlled ? onChange : () => { }}
            className="form-control"
            name={props.name}
            rows={props.rows ?? 5}
            cols={props.cols ?? 1}
        />
        {error && error.length > 0 && <span className="text-danger d-block mt-1">{error.at(0)}</span>}
    </div>
}
