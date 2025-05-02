import { useApi, useAuthStore } from "hooks";
import { ReactNode, useEffect } from "react";
import { Block, Button, PageTitle } from "ui";
import { Link, Pagination } from '@base/components'
import { range } from "functions";
import Skeleton from "react-loading-skeleton";

export function JardinList(): ReactNode {
    const { Client, datas: jardins, RequestState } = useApi<Garden>({
        url: '/jardin-scolaires',
        key: 'data'
    })

    const queryParams = {
        paginate: true,
        perPage: 10
    }

    const getDatas = async () => {
        await Client.get(queryParams)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({
            ...queryParams,
            page: data.page
        })
    }

    useEffect(() => {
        getDatas()
    }, [])

    function handleDelete(id: number) {
        alert(id)
    }

    const { isAdmin } = useAuthStore()

    return <>
        <PageTitle title="Jardin scolaires (Distribution)">
            <Link can={isAdmin} to="/scholar-garden/add" className="btn btn-primary">
                <i className="bi bi-plus-lg me-2"></i>Nouveau jardin
            </Link>
        </PageTitle>

        <Block>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Ecole</th>
                        <th>Année</th>
                        <th>Matériels</th>
                        <th>Engrais</th>
                        <th>Sémences</th>
                        <th>Etapes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {RequestState.loading &&
                        range(10).map((number) => (
                            <tr key={number}>
                                {range(7).map((key) => (
                                    <td key={key} className="text-center">
                                        <Skeleton style={{ height: 30 }} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    {jardins?.length > 0 && jardins?.map((jardin: Garden) => <tr key={jardin.id}>
                        <td>{jardin?.school?.name}</td>
                        <td>{jardin.year}</td>
                        <td>
                            <ul>
                                {jardin.materials?.map(material => <li key={material.id}>{material.name}: {material.pivot.quantity}</li>)}
                            </ul>
                        </td>
                        <td><ul>{jardin.engrais?.map((engrais: Engrais) => <li key={engrais.id}>{engrais.name}: {engrais.pivot.quantity} {engrais.unit}</li>)}</ul></td>
                        <td><ul>{jardin.semences?.map((semence: Semence) => <li key={semence.id}>{semence.name}: {semence.pivot.quantity} {semence.unit}</li>)}</ul></td>
                        <td>{Object.keys(jardin.steps ?? {}).length}</td>
                        <td>
                            <Link to={`/scholar-garden/show/${jardin.id}`} className="btn btn-info btn-sm me-2"><i className="bi bi-folder"></i></Link>
                            <Link can={isAdmin} to={`/scholar-garden/edit/${jardin.id}`} className="btn btn-primary btn-sm me-2"><i className="bi bi-pencil-square"></i></Link>
                            <Button can={isAdmin} icon="trash" mode="danger" size="sm" onClick={() => handleDelete(jardin.id)} />
                        </td>
                    </tr>)}
                </tbody>
            </table>
            {jardins?.meta?.total > jardins?.meta?.per_page && <Pagination changePage={changePage} data={jardins} />}
        </Block>
    </>
}