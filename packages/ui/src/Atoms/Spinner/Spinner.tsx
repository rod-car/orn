export function Spinner ({ isBorder = false, className }: { isBorder?: boolean, className?: string }): JSX.Element {
    return <div className={className}>
        <div className={isBorder ? "spinner-border" : "spinner-grow"} role="status">
            <span className="visually-hidden">Chargement...</span>
        </div>
    </div>
}