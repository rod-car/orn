import { useApi } from 'hooks'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import { config, abaque } from '../../../config'
import { Button, Select } from 'ui'
import { toast } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert'

export function ListMeasure(): JSX.Element {
    const [abaqueType, setAbaqueType] = useState(abaque.abaqueTypes[0].id)

    const {
        Client,
        RequestState,
        datas: abaques
    } = useApi<MeasureLength>({
        baseUrl: config.baseUrl,
        url: '/measures'
    })

    const getAbaques = useCallback(async () => {
        await Client.get({
            type: abaqueType
        })
    }, [abaqueType])

    useEffect(() => {
        getAbaques()
    }, [abaqueType])

    const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setAbaqueType(e.target.value)
    }

    const remove = async (abaqueId: number): Promise<void> => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await Client.destroy(abaqueId, { type: abaqueType })
                        if (response.ok) {
                            toast('Supprimé', {
                                closeButton: true,
                                type: 'success',
                                position: 'bottom-right'
                            })
                            getAbaques()
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error',
                                position: 'bottom-right'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error',
                            position: 'bottom-right'
                        })
                }
            ]
        })
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="m-0">Liste des abaques</h1>
                <Link to="/measure/add" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Ajouter un abaque
                </Link>
            </div>

            <table className="table table-striped mb-5">
                <thead>
                    <tr>
                        <th>Type d'abaque</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Select
                                options={abaque.abaqueTypes}
                                value={abaqueType}
                                onChange={handleTypeChange}
                                controlled
                                required
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="table-responsive border mb-5">
                {[
                    'weight-age-male',
                    'weight-age-female',
                    'length-age-male',
                    'length-age-female'
                ].includes(abaqueType) && (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Age</th>
                                <th>Z-3</th>
                                <th>Z-2</th>
                                <th>Z-1</th>
                                <th>Z+0</th>
                                <th>Z+1</th>
                                <th>Z+2</th>
                                <th>Z+3</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RequestState.loading === false && abaques.length <= 0 && (
                                <tr>
                                    <td className="text-center" colSpan={8}>
                                        Aucun données
                                    </td>
                                </tr>
                            )}
                            {abaques.map((abaque) => (
                                <tr key={abaque['age']}>
                                    <td>{abaque['age']}</td>
                                    <td>{abaque['Z-3']}</td>
                                    <td>{abaque['Z-2']}</td>
                                    <td>{abaque['Z-1']}</td>
                                    <td>{abaque['Z+0']}</td>
                                    <td>{abaque['Z+1']}</td>
                                    <td>{abaque['Z+2']}</td>
                                    <td>{abaque['Z+3']}</td>
                                    <td>
                                        <Link
                                            className="me-2 btn btn-primary btn-sm"
                                            to={{
                                                pathname: `/measure/edit/${abaque.id}`,
                                                search: `?${createSearchParams({
                                                    type: abaqueType
                                                })}`
                                            }}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Link>

                                        <Button
                                            onClick={(): Promise<void> => remove(abaque.id)}
                                            type="button"
                                            icon="trash"
                                            mode="danger"
                                            size="sm"
                                        />
                                    </td>
                                </tr>
                            ))}
                            {RequestState.loading && (
                                <tr>
                                    <td className="text-center" colSpan={8}>
                                        Chargement
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {abaqueType === 'imc-age' && (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Age</th>
                                <th>Z-3</th>
                                <th>Z-2</th>
                                <th>Z-1</th>
                                <th>Z+1</th>
                                <th>Z+2</th>
                                <th className="w-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RequestState.loading === false && abaques.length <= 0 && (
                                <tr>
                                    <td className="text-center" colSpan={7}>
                                        Aucun données
                                    </td>
                                </tr>
                            )}
                            {abaques.map((abaque) => (
                                <tr key={abaque['age']}>
                                    <td>{abaque['age']}</td>
                                    <td>{abaque['Z-3']}</td>
                                    <td>{abaque['Z-2']}</td>
                                    <td>{abaque['Z-1']}</td>
                                    <td>{abaque['Z+1']}</td>
                                    <td>{abaque['Z+2']}</td>
                                    <td>
                                        <Link
                                            className="me-2 btn btn-primary btn-sm"
                                            to={{
                                                pathname: `/measure/edit/${abaque.id}`,
                                                search: `?${createSearchParams({
                                                    type: abaqueType
                                                })}`
                                            }}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Link>

                                        <Button
                                            onClick={(): Promise<void> => remove(abaque.id)}
                                            type="button"
                                            icon="trash"
                                            mode="danger"
                                            size="sm"
                                        />
                                    </td>
                                </tr>
                            ))}
                            {RequestState.loading && (
                                <tr>
                                    <td className="text-center" colSpan={7}>
                                        Chargement
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {abaqueType === 'length-weight' && (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Taille</th>
                                <th>TS-4</th>
                                <th>MAS-3</th>
                                <th>MAM-2</th>
                                <th>SORTIE-1_5</th>
                                <th>NORMAL-1</th>
                                <th>MEDIAN-0</th>
                                <th className="w-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RequestState.loading === false && abaques.length <= 0 && (
                                <tr>
                                    <td className="text-center" colSpan={8}>
                                        Aucun données
                                    </td>
                                </tr>
                            )}
                            {abaques.map((abaque, key) => (
                                <tr key={key}>
                                    <td>{abaque['taille']}</td>
                                    <td>{abaque['TS-4']}</td>
                                    <td>{abaque['MAS-3']}</td>
                                    <td>{abaque['MAM-2']}</td>
                                    <td>{abaque['SORTIE-1_5']}</td>
                                    <td>{abaque['NORMAL-1']}</td>
                                    <td>{abaque['MEDIAN-0']}</td>
                                    <td>
                                        <Link
                                            className="me-2 btn btn-primary btn-sm"
                                            to={{
                                                pathname: `/measure/edit/${abaque.id}`,
                                                search: `?${createSearchParams({
                                                    type: abaqueType
                                                })}`
                                            }}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Link>

                                        <Button
                                            onClick={(): Promise<void> => remove(abaque.id)}
                                            type="button"
                                            icon="trash"
                                            mode="danger"
                                            size="sm"
                                        />
                                    </td>
                                </tr>
                            ))}
                            {RequestState.loading && (
                                <tr>
                                    <td className="text-center" colSpan={8}>
                                        Chargement
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}
