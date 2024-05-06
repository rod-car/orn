type TableProps<T> = {
    /**
     * Entête pour le tableau
     */
    theads: Record<string, string>;

    datas: T[];
}

export function Table<T> ({ theads, datas }: TableProps<T>) {
    const keys = Object.keys(theads);

    return <table className="table table-striped w-100">
        <thead>
            <tr>
                {Object.values(theads).map(head => <th key={head}>{head}</th>)}
            </tr>
        </thead>
        <tbody>
            {datas.map(data => <TableRow data={data} elementKey={10} keys={keys as (keyof T)[]} />)}
        </tbody>
    </table>
}

type TableRowProps<T> = {
    keys: (keyof T)[];
    elementKey: number;
    data: T
}

function TableRow<T>({ keys, elementKey, data }: TableRowProps<T>) {
    return <tr key={elementKey}>
        {keys.map(key => <td>{data[key.toString()]}</td>)}
    </tr>
}