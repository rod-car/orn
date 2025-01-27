export default function Loading() {
    return <div className="container p-5">
        <div className="text-center text-primary">
            <div className="spinner-border" style={{width: '4rem', height: '4rem'}} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    </div>
}