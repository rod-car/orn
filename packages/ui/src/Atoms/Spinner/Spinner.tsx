export function Spinner ({ isBorder = false, className, size = 'md' }: { isBorder?: boolean, className?: string, size?: string }): JSX.Element {
    return <div className={className}>
        <div className={isBorder ? `spinner-border spinner-border-${size}` : `spinner-grow spinner-grow-${size}`} role="status">
            <span className="visually-hidden">Chargement...</span>
        </div>
    </div>
}