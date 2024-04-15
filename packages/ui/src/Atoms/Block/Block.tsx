import { PropsWithChildren, ReactNode } from "react"

export const Block = (props: PropsWithChildren & { className: string }): ReactNode => {
    return <div className={`rounded shadow-lg p-4 ${props.className}`}>{props.children}</div>
}
