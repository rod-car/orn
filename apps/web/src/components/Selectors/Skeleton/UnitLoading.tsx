import { range } from "functions";
import { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import { Block } from "ui";

export function UnitLoading(): ReactNode {
    return <Block>
        <table className="table table-striped table-bordered table-hover text-sm">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Label</th>
                    <th>Notation</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {range(10).map((index) => <tr key={index}>
                    {range(4).map(tdindex => <td key={tdindex}>
                        <Skeleton key={index} style={{ height: 30 }} />
                    </td>)}
                </tr>
                )}
            </tbody>
        </table>
    </Block>
}