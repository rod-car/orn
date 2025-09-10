import { range } from "functions";
import { memo, ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import { Block } from "ui";

export const ActivityLoading = memo(function ({ reverse, admin }: { reverse?: boolean, admin?: boolean }): ReactNode {
    return <>
        {!admin ? <div className="card shadow-lg rounded">
            <Skeleton count={1} style={{ height: 250, width: '100%' }} />

            <div className="p-3">
                <Skeleton count={1} style={{ height: 30, width: '100%' }} />
                <Skeleton count={1} style={{ height: 30, width: '100%' }} />
                <Skeleton count={1} style={{ height: 30, width: '100%' }} />
            </div>

            <div className="card-footer">
                <Skeleton count={1} style={{ height: 30, width: '100%' }} />
            </div>
        </div> : <Block>
            <table className="table table-striped table-bordered text-sm">
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
            </table>
        </Block>}
    </>
})