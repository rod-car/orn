import { range } from "functions";
import { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";

type TableLoadingProps = {
    cols: number
    rows: number
}

export function TableLoading({ cols, rows }: TableLoadingProps): ReactNode {
    return range(rows).map((number) => (
        <tr key={number}>
            {range(cols).map((key) => (
                <td key={key} className="text-center">
                    <Skeleton count={1} style={{ height: 30 }} />
                </td>
            ))}
        </tr>
    ))
}