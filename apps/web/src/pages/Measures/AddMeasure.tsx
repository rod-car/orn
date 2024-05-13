import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link } from '@renderer/components'
import { config, token, abaque } from '../../config'
import { Block, Button, Input, Select } from 'ui'
import { toast } from 'react-toastify'

export function AddMeasure(): JSX.Element {
    const [abaqueType, setAbaqueType] = useState(abaque.abaqueTypes[0].id)
    const [abaqueFields, setAbaqueFields] = useState<Array<Partial<typeof abaque.defaultFields>>>([
        { ...abaque.defaultFields }
    ])

    const { Client, RequestState } = useApi<MeasureLengthAge>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/measures'
    })

    const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setAbaqueType(e.target.value)
    }

    const handleFieldChange = (mainKey: number, valueKey: string, value: number): void => {
        abaqueFields[mainKey][valueKey] = value
        setAbaqueFields([...abaqueFields])
    }

    const add = (): void => {
        setAbaqueFields([...abaqueFields, { ...abaque.defaultFields }])
    }

    const remove = (mainKey: number): void => {
        const fields = abaqueFields.filter((_value, key) => {
            return key !== mainKey
        })
        setAbaqueFields([...fields])
    }

    const save = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await Client.post(abaqueFields, '', {
            type: abaqueType
        })

        if (response.ok) {
            toast(response.message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            setAbaqueFields([{ ...abaque.defaultFields }])
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
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="m-0">Ajouter un abaque</h2>
                <Link to="/measure/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des abaques
                </Link>
            </div>

            <Block>
                <form action="" onSubmit={save}>
                    <div className="mb-5">
                        <Select
                            label="Type d'abaque"
                            options={abaque.abaqueTypes}
                            value={abaqueType}
                            onChange={handleTypeChange}
                            controlled
                            required
                        />
                    </div>

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
                                    </tr>
                                </thead>
                                <tbody>
                                    {abaqueFields.map((field, key) => (
                                        <tr key={key}>
                                            <td>
                                                <Input
                                                    onChange={(e): void =>
                                                        handleFieldChange(
                                                            key,
                                                            'age',
                                                            e.target.value as unknown as number
                                                        )
                                                    }
                                                    value={field.age}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    onChange={(e): void =>
                                                        handleFieldChange(
                                                            key,
                                                            'Z-3',
                                                            e.target.value as unknown as number
                                                        )
                                                    }
                                                    value={field['Z-3']}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    onChange={(e): void =>
                                                        handleFieldChange(
                                                            key,
                                                            'Z-2',
                                                            e.target.value as unknown as number
                                                        )
                                                    }
                                                    value={field['Z-2']}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    onChange={(e): void =>
                                                        handleFieldChange(
                                                            key,
                                                            'Z-1',
                                                            e.target.value as unknown as number
                                                        )
                                                    }
                                                    value={field['Z-1']}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    onChange={(e): void =>
                                                        handleFieldChange(
                                                            key,
                                                            'Z+0',
                                                            e.target.value as unknown as number
                                                        )
                                                    }
                                                    value={field['Z+0']}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    onChange={(e): void =>
                                                        handleFieldChange(
                                                            key,
                                                            'Z+1',
                                                            e.target.value as unknown as number
                                                        )
                                                    }
                                                    value={field['Z+1']}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    onChange={(e): void =>
                                                        handleFieldChange(
                                                            key,
                                                            'Z+2',
                                                            e.target.value as unknown as number
                                                        )
                                                    }
                                                    value={field['Z+2']}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    onChange={(e): void =>
                                                        handleFieldChange(
                                                            key,
                                                            'Z+3',
                                                            e.target.value as unknown as number
                                                        )
                                                    }
                                                    value={field['Z+3']}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                {key > 0 ? (
                                                    <Button
                                                        icon="minus"
                                                        onClick={(): void => remove(key)}
                                                        mode="danger"
                                                    ></Button>
                                                ) : (
                                                    <Button
                                                        icon="plus"
                                                        onClick={add}
                                                        mode="primary"
                                                    ></Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
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
                                </tr>
                            </thead>
                            <tbody>
                                {abaqueFields.map((field, key) => (
                                    <tr key={key}>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'age',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field.age}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'Z-3',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['Z-3']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'Z-2',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['Z-2']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'Z-1',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['Z-1']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'Z+1',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['Z+1']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'Z+2',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['Z+2']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            {key > 0 ? (
                                                <Button
                                                    icon="minus"
                                                    onClick={(): void => remove(key)}
                                                    mode="danger"
                                                ></Button>
                                            ) : (
                                                <Button
                                                    icon="plus"
                                                    onClick={add}
                                                    mode="primary"
                                                ></Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
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
                                </tr>
                            </thead>
                            <tbody>
                                {abaqueFields.map((field, key) => (
                                    <tr key={key}>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'taille',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field.taille}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'TS-4',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['TS-4']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'MAS-3',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['MAS-3']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'MAM-2',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['MAM-2']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'SORTIE-1_5',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['SORTIE-1_5']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'NORMAL-1',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['NORMAL-1']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                onChange={(e): void =>
                                                    handleFieldChange(
                                                        key,
                                                        'MEDIAN-0',
                                                        e.target.value as unknown as number
                                                    )
                                                }
                                                value={field['MEDIAN-0']}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            {key > 0 ? (
                                                <Button
                                                    icon="minus"
                                                    onClick={(): void => remove(key)}
                                                    mode="danger"
                                                ></Button>
                                            ) : (
                                                <Button
                                                    icon="plus"
                                                    onClick={add}
                                                    mode="primary"
                                                ></Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <Button
                        loading={RequestState.creating}
                        type="submit"
                        icon="save"
                        mode="primary"
                        className="mt-4"
                    >
                        Enregistrer
                    </Button>
                </form>
            </Block>
        </>
    )
}
