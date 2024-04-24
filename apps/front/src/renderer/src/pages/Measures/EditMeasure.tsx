import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { config, abaque as abaqueConfig, getToken } from '../../../config'
import { Button, Input } from 'ui'
import { toast } from 'react-toastify'
import { Link } from '@renderer/components'

export function EditMeasure(): JSX.Element {
    const [abaque, setAbaque] = useState<Partial<MeasureLength>>(abaqueConfig.defaultFields)
    const { id } = useParams()
    const { Client, RequestState } = useApi<MeasureLength>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/measures'
    })

    const getData = useCallback(async (): Promise<void> => {
        const response = await Client.find(id as unknown as number, { type: type as string })
        setAbaque({ ...response })
    }, [])

    const [searchParams] = useSearchParams()
    const type = searchParams.get('type') as string

    useEffect(() => {
        getData()
    }, [])

    const handleChange = useCallback((key: string, value: number) => {
        const newData = { ...abaque, [key]: value }
        setAbaque(newData)
    }, [])

    const save = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await Client.patch(id as unknown as number, abaque, {
            type: type as string
        })

        if (response.ok) {
            toast(response.message, {
                closeButton: true,
                type: 'success',
                position: 'bottom-right'
            })
        } else {
            toast(response.message, {
                closeButton: true,
                type: 'error',
                position: 'bottom-right'
            })
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="m-0">Modifier: {abaqueConfig.find(type)}</h2>
                <Link to="/measure/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des abaques
                </Link>
            </div>

            <form action="" onSubmit={save}>
                {[
                    'weight-age-male',
                    'weight-age-female',
                    'length-age-male',
                    'length-age-female'
                ].includes(type as string) && (
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="form-control">{abaque.age ?? 0}</div>
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z-3',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z-3']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z-2',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z-2']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z-1',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z-1']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z+0',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z+0']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z+1',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z+1']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z+2',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z+2']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z+3',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z+3']}
                                        type="number"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {type === 'imc-age' && (
                    <table className="table table-striped">
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
                            <tr>
                                <td>
                                    <div className="form-control">{abaque.age ?? 0}</div>
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z-3',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z-3']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z-2',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z-2']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z-1',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z-1']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z+1',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z+1']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'Z+2',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['Z+2']}
                                        type="number"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {type === 'length-weight' && (
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="form-control">{abaque.taille ?? 0}</div>
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'TS-4',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['TS-4']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'MAS-3',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['MAS-3']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'MAM-2',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['MAM-2']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'SORTIE-1_5',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['SORTIE-1_5']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'NORMAL-1',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['NORMAL-1']}
                                        type="number"
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                            handleChange(
                                                'MEDIAN-0',
                                                parseFloat(e.target as unknown as string)
                                            )
                                        }
                                        value={abaque['MEDIAN-0']}
                                        type="number"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                <Button
                    loading={RequestState.updating}
                    type="submit"
                    icon="save"
                    mode="primary"
                    className="mt-4"
                >
                    Enregistrer
                </Button>
            </form>
        </>
    )
}
