import { useApi, useExcelReader } from 'hooks'
import { ChangeEvent, ReactNode, useState } from 'react'
import { Link, PrimaryLink } from '@base/components'
import { Block, Button, Input, PageTitle, PrimaryButton, Select, Spinner } from 'ui'
import { config, abaque } from '@base/config'
import { toast } from 'react-toastify'

export function ImportAbaque(): ReactNode {
    const [abaqueType, setAbaqueType] = useState(abaque.abaqueTypes[0].id)
    const { json, importing, toJSON, resetJSON } = useExcelReader()

    const { Client, RequestState } = useApi<MeasureLength>({
        baseUrl: config.baseUrl,
        url: '/measures'
    })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        toJSON(e.target)
    }

    const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setAbaqueType(e.target.value)
    }

    const save = async (): Promise<void> => {
        toast('Importation en cours', {
            type: 'info',
            closeButton: false,
            isLoading: RequestState.creating,
            position: config.toastPosition
        })

        const response = await Client.post(json as unknown as MeasureLength, '/import', {
            abaqueType: abaqueType
        })

        if (response.ok) {
            toast(response.message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            resetJSON()
        } else {
            toast(response.message, {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    return (
        <>
            <PageTitle title="Importer une liste d'abaque">
                <PrimaryLink icon="list" to="/anthropo-measure/abaques/list">
                    Liste des abaques
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-3">
                <form action="" encType="multipart/form-data">
                    <div className="row">
                        <div className="col-6">
                            <Input
                                type="file"
                                required={true}
                                label="Selectionner un fichier"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="col-6">
                            <Select
                                label="Type d'abaque"
                                options={abaque.abaqueTypes}
                                value={abaqueType}
                                onChange={handleTypeChange}
                                controlled
                                required
                            />
                        </div>
                    </div>
                </form>
            </Block>

            <Block>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-primary">
                        Affichage temporaire des données{' '}
                        {json.length > 0 && `(${json.length} Enregistrement(s))`}
                    </h6>
                    {json.length > 0 && (
                        <PrimaryButton
                            loading={RequestState.creating}
                            icon="save"
                            onClick={save}
                        >
                            Enregistrer
                        </PrimaryButton>
                    )}
                </div>
                <hr />
                <div className="table-responsive border">
                    {[
                        'weight-age-male',
                        'weight-age-female',
                        'length-age-male',
                        'length-age-female'
                    ].includes(abaqueType) && (
                            <table className="table-bordered text-sm table table-striped">
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {json.length <= 0 && (
                                        <tr>
                                            <td className="text-center" colSpan={8}>
                                                Aucun données
                                            </td>
                                        </tr>
                                    )}
                                    {json.map((json) => (
                                        <tr key={json['age']}>
                                            <td>{json['age']}</td>
                                            <td>{json['Z-3']}</td>
                                            <td>{json['Z-2']}</td>
                                            <td>{json['Z-1']}</td>
                                            <td>{json['Z+0']}</td>
                                            <td>{json['Z+1']}</td>
                                            <td>{json['Z+2']}</td>
                                            <td>{json['Z+3']}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                    {abaqueType === 'imc-age' && (
                        <table className="table-bordered text-sm table table-striped">
                            <thead>
                                <tr>
                                    <th>Age</th>
                                    <th>Z-3</th>
                                    <th>Z-2</th>
                                    <th>Z-1</th>
                                    <th>Z+1</th>
                                    <th>Z+2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {json.length <= 0 && (
                                    <tr>
                                        <td className="text-center" colSpan={6}>
                                            Aucun données
                                        </td>
                                    </tr>
                                )}
                                {json.map((json) => (
                                    <tr key={json['age']}>
                                        <td>{json['age']}</td>
                                        <td>{json['Z-3']}</td>
                                        <td>{json['Z-2']}</td>
                                        <td>{json['Z-1']}</td>
                                        <td>{json['Z+1']}</td>
                                        <td>{json['Z+2']}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {abaqueType === 'length-weight' && (
                        <table className="table-bordered text-sm table table-striped">
                            <thead>
                                <tr>
                                    <th>Taille</th>
                                    <th>TS-4</th>
                                    <th>MAS-3</th>
                                    <th>MAM-2</th>
                                    <th>SORTIE-1_5</th>
                                    <th>NORMAL-1</th>
                                    <th>MEDIAN-0</th>
                                </tr>
                            </thead>
                            <tbody>
                                {json.length <= 0 && (
                                    <tr>
                                        <td className="text-center" colSpan={7}>
                                            Aucun données
                                        </td>
                                    </tr>
                                )}
                                {json.map((json) => (
                                    <tr key={json['taille']}>
                                        <td>{json['taille']}</td>
                                        <td>{json['TS-4']}</td>
                                        <td>{json['MAS-3']}</td>
                                        <td>{json['MAM-2']}</td>
                                        <td>{json['SORTIE-1_5']}</td>
                                        <td>{json['NORMAL-1']}</td>
                                        <td>{json['MEDIAN-0']}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {importing && <Spinner />}

                {json.length > 0 && (
                    <Button
                        loading={RequestState.creating}
                        icon="save"
                        type="button"
                        mode="primary"
                        onClick={save}
                        className="mt-3"
                    >
                        Enregistrer
                    </Button>
                )}
            </Block>
        </>
    )
}
