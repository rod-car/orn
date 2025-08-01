import { range } from "functions";
import { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import { Block } from "ui";

export function ArticleLoading(): ReactNode {
    return <Block>
        <table className="table table-striped table-bordered table-hover text-sm">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Designation</th>
                    <th>Unite</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {range(10).map((index) => <tr key={index}>
                    {range(5).map(tdindex => <td key={tdindex}>
                        <Skeleton key={index} style={{ height: 30 }} />
                    </td>)}
                </tr>
                )}
            </tbody>
        </table>
    </Block>
}