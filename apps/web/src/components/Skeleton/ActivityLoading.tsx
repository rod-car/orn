import { range } from "functions";
import { memo, ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import { Block } from "ui";

export const ActivityLoading = memo(function ({ reverse, admin }: { reverse?: boolean, admin?: boolean }): ReactNode {
    return <Block>
        {!admin ? <div className={`d-flex justify-content-between ${reverse ? 'flex-row-reverse' : ''}`}>
            <div className={`w-50 ${reverse ? '' : 'me-4'}`}>
                <div className="mb-3">
                    <Skeleton count={1} style={{ height: 30, width: '50%' }} />
                </div>
                <div className="mb-3">
                    <Skeleton count={1} style={{ width: '75%' }} />
                </div>
                <Skeleton count={5} />
                <div className="mt-4">
                    <Skeleton count={1} style={{ height: 30, width: '25%' }} />
                </div>
            </div>
            <div className={`w-50 ${reverse ? 'me-4' : ''}`}>
                <div className="row">
                    {range(4).map(index => <div key={index} className="col-6 mb-3">
                        <Skeleton key={index} style={{ height: 120 }} />
                    </div>)}
                </div>
            </div>
        </div> : <table className="table table-striped table-bordered text-sm">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Titre</th>
                    <th>Date</th>
                    <th>Lieu</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {range(10).map((index) => <tr key={index}>
                    {range(5).map(tdindex => <td key={tdindex}>
                        <Skeleton key={index} style={{ height: 30 }} />
                    </td>)}
                </tr>)}
            </tbody>
        </table>}
    </Block>
})