import './Input.module.scss'

import { ChangeEvent, CSSProperties, ForwardedRef, forwardRef, useCallback, useId, useState } from "react"
import { RequiredSign } from '../RequiredSign/RequiredSign'
import { AutoSign } from '../AutoSign/AutoSign'

type InputProps = React.ComponentProps<"input"> & {
    label?: string;
    required?: boolean;
    elementSize?: ElementSize;
    controlled?: boolean;
    auto?: boolean;
    error?: string[];
    srOnly?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef(function({
    type = 'text',
    required = true,
    elementSize = "md",
    controlled = true,
    className,
    auto = false,
    error = undefined,
    srOnly = false,
    ...props
}: InputProps, ref: ForwardedRef<HTMLInputElement>) {
    const id = useId();
    const iconKey = useId();
    const [showPassword, setShowPassword] = useState(false);
    const toogleViewPassword = useCallback(() => {
        setShowPassword(v => !v)
    }, [])

    if (auto) props.disabled = true

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        if (props.onChange) props.onChange(event)
    }

    return <div className={`form-group ${className}`}>
        {props.label && <label style={styles.small} className={`form-label fw-semibold ${srOnly ? 'sr-only' : ''}`} htmlFor={id}>
            {props.label}
            {auto === false && <RequiredSign value={required} />}
            <AutoSign value={auto} />
        </label>}
        <div style={styles.relative}>
            <input
                id={id}
                style={styles.small}
                ref={ref}
                {...props}
                type={showPassword ? 'text' : type}
                name={props.name}
                value={controlled ? props.value : undefined}
                onChange={controlled ? handleChange : () => {}}
                placeholder={props.placeholder}
                className={`form-control shadow-sm input-${elementSize}`}
                autoComplete='off'
            />
            {type === 'password' && <span key={iconKey} style={styles.showHide} onClick={toogleViewPassword}>
                <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
            </span>}
        </div>
        {error && error.length > 0 && <span style={styles.small} className="text-danger d-block mt-1">{error.at(0)}</span>}
    </div>
})

const styles: Record<string, CSSProperties> = {
    showHide: {
        position: 'absolute',
        top: '25%',
        right: '10px',
        cursor: 'pointer'
    },
    relative: {
        position: 'relative'
    },
    small: {
        fontSize: 'small'
    }
}