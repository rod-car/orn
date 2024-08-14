import { ErrorResponse } from "react-router";

export function ErrorComponent({ error }: { error: ErrorResponse }): ReactNode {
    return (
        <>
            <div className="text-center">
                <h2>{error?.statusText}</h2>
                <h2>{error?.status}</h2>
            </div>
        </>
    )
}