import { ReactNode, useId } from "react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';

type RTEProps = {label?: string, theme: string, value: string, onChange: (value: string) => void}
export function RichTextEditor({label, theme, value, onChange}: RTEProps): ReactNode {
    const id = useId()
    return <div className="form-group">
        {label && <label style={{ fontSize: 'small' }} className="form-label fw-semibold" htmlFor={id}>{label}</label>}
        <ReactQuill id={id} theme={theme} value={value} onChange={onChange} />
    </div>
}