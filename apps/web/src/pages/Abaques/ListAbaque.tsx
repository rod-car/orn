/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { createSearchParams } from 'react-router-dom'
import { config, abaque } from '@base/config'
import { Block, DangerButton, PageTitle, Select } from 'ui'
import { toast } from '@base/ui';
import { confirmAlert } from 'react-confirm-alert'
import { EditLink, PrimaryLink } from '@base/components'

export function ListAbaque(): ReactNode {
    const [abaqueType, setAbaqueType] = useState(abaque.abaqueTypes[0].id)
    const { Client, RequestState, datas: abaques } = useApi<MeasureLength>({
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
                                type: 'success'
                            })
                            getAbaques()
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error'
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error'
                        })
                }
            ]
        })
    }

    return (
        <>
            <PageTitle title="Liste des abaques">
                <PrimaryLink permission="abaque.view" icon="plus-lg" to="/anthropo-measure/abaques/add">
                    Ajouter un abaque
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-3">
                <table className="text-sm table table-bordered table-striped m-0">
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
            </Block>

            <Block className="mb-5">
                <div className="text-sm table-responsive border">
                    {[
                        'weight-age-male',
                        'weight-age-female',
                        'length-age-male',
                        'length-age-female'
                    ].includes(abaqueType) && (
                            <table className="text-sm table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Age</th>
                                        <th>3</th>
                                        <th>10</th>
                                        <th>25</th>
                                        <th>50</th>
                                        <th>75</th>
                                        <th>90</th>
                                        <th>97</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RequestState.loading === false && abaques.length <= 0 && (
                                        <tr>
                                            <td className="text-center" colSpan={9}>
                                                Aucun données
                                            </td>
                                        </tr>
                                    )}
                                    {abaques.map((abaque) => (
                                        <tr key={abaque['age']}>
                                            <td>{abaque['age']}</td>
                                            <td>{abaque['Z+3']}</td>
                                            <td>{abaque['Z+10']}</td>
                                            <td>{abaque['Z+25']}</td>
                                            <td>{abaque['Z+50']}</td>
                                            <td>{abaque['Z+75']}</td>
                                            <td>{abaque['Z+90']}</td>
                                            <td>{abaque['Z+97']}</td>
                                            <td>
                                                <EditLink
                                                    permission="abaque.edit"
                                                    className="me-2 btn-sm"
                                                    to={{
                                                        pathname: `/anthropo-measure/abaques/edit/${abaque.id}`,
                                                        search: `?${createSearchParams({
                                                            type: abaqueType
                                                        })}`
                                                    }}
                                                />

                                                <DangerButton
                                                    permission="abaque.delete"
                                                    onClick={() => remove(abaque.id)}
                                                    icon="trash"
                                                    size="sm"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {RequestState.loading && (
                                        <tr>
                                            <td className="text-center" colSpan={9}>
                                                Chargement
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                    {abaqueType === 'imc-age' && (
                        <table className="text-sm table table-bordered table-striped">
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
                                            <EditLink
                                                permission="abaque.edit"
                                                className="me-2 btn btn-primary btn-sm"
                                                to={{
                                                    pathname: `/anthropo-measure/abaques/edit/${abaque.id}`,
                                                    search: `?${createSearchParams({
                                                        type: abaqueType
                                                    })}`
                                                }}
                                            />

                                            <DangerButton
                                                permission="abaque.delete"
                                                onClick={() => remove(abaque.id)}
                                                icon="trash"
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
                        <table className="text-sm table table-bordered table-striped">
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
                                        <td className="text-center" colSpan={9}>
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
                                            <EditLink
                                                permission="abaque.edit"
                                                className="me-2 btn-sm"
                                                to={{
                                                    pathname: `/anthropo-measure/abaques/edit/${abaque.id}`,
                                                    search: `?${createSearchParams({
                                                        type: abaqueType
                                                    })}`
                                                }}
                                            />

                                            <DangerButton
                                                permission="abaque.delete"
                                                onClick={() => remove(abaque.id)}
                                                icon="trash"
                                                size="sm"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {RequestState.loading && (
                                    <tr>
                                        <td className="text-center" colSpan={9}>
                                            Chargement
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Block>
        </>
    )
}
