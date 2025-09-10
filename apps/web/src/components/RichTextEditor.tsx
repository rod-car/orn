import { ReactNode, useEffect, useId } from "react"
import ReactQuill, { ReactQuillProps } from "react-quill"
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.scss'

import katex from 'katex'

type RTEProps = { label?: string, theme: string, value: string, onChange: (value: string) => void }

export function RichTextEditor({ label, theme, value, onChange, ...props }: RTEProps & ReactQuillProps): ReactNode {
    const id = useId()

    useEffect(() => {
        window.katex = katex
    }, [])
    return <div className="form-group">
        {label && <label style={{ fontSize: 'small' }} className="form-label fw-semibold" htmlFor={id}>{label}</label>}

        <ReactQuill modules={{
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                ['link', 'formula'],

                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean']                                         // remove formatting button
              ]
        }} {...props} id={id} theme={theme} value={value} onChange={onChange} />
    </div>
}