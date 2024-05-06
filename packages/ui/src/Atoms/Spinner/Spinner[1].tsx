export function Spinner ({ className }: { className?: string }): JSX.Element {
    return <div className={className}>
        <div className="spinner-grow" role="status">
            <span className="visually-hidden">Chargement...</span>
        </div>
    </div>
}