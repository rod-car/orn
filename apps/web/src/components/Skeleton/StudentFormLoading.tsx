import Skeleton from 'react-loading-skeleton'

export function StudentFormLoading(): React.ReactNode {
    return (
        <form action="" method="post" className="mb-5">
            <div className="row mb-3">
                <div className="col-xl-1">
                    <Skeleton style={{ height: 30 }} />
                </div>
                <div className="col-xl-5">
                    <Skeleton style={{ height: 30 }} />
                </div>
                <div className="col-xl-6">
                    <Skeleton style={{ height: 30 }} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-xl-3">
                    <Skeleton style={{ height: 30 }} />
                </div>
                <div className="col-xl-3">
                    <Skeleton style={{ height: 30 }} />
                </div>
                <div className="col-xl-6">
                    <Skeleton style={{ height: 30 }} />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-xl-3">
                <Skeleton style={{ height: 30 }} />
                </div>
                <div className="col-xl-3">
                    <Skeleton style={{ height: 30 }} />
                </div>
                <div className="col-xl-3">
                <Skeleton style={{ height: 30 }} />
                </div>
                <div className="col-xl-3">
                <Skeleton style={{ height: 30 }} />
                </div>
            </div>

            <div className="row">
                <div className="col-2">
                    <Skeleton style={{ height: 30 }} />
                </div>
            </div>
        </form>
    )
}
