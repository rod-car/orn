import { ChangeEvent, useId } from "react"

import './Textarea.module.scss'
import { RequiredSign } from "../RequiredSign/RequiredSign";

type TextareaProps = {
    label?: string;
    required?: boolean;
    controlled?: boolean;
    rows?: number;
    cols?: number;
    value?: string | number;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({ label, onChange, controlled = true, required = true, ...props }: TextareaProps) {
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
            rows={props.rows ?? 5}
            cols={props.cols ?? 1}
        />
    </div>
}
