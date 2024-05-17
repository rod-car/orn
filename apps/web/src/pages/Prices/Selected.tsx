export function Selected({ data, onRemove }: { data: Partial<Article & Site>, onRemove: () => void }): ReactNode {
    return <span onClick={onRemove} className="rounded shadow py-1 px-2 me-3" style={{ border: '1px solid black', justifySelf: 'start', fontSize: '10pt' }}>
        {data?.designation ?? data.name}
        <i className="fa fa-close" style={{ cursor: 'pointer', verticalAlign: 'middle', marginLeft: '15px' }}></i>
    </span>
}