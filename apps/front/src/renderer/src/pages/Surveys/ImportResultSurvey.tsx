import { useApi, useExcelReader } from 'hooks'
import { NavLink, useParams } from 'react-router-dom'
import { ApiErrorMessage, Button, Input, Spinner } from 'ui'
import { config, token } from '../../../config'
import { ChangeEvent } from 'react'
import { toast } from 'react-toastify'

export function ImportResultSurvey(): JSX.Element {
    const { json, importing, toJSON, resetJSON } = useExcelReader()
    const { Client, RequestState, error, resetError } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: token,
        url: 'surveys'
    })

    const { id } = useParams()

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        toJSON(e.target)
    }

    const save = async (): Promise<void> => {
        toast('Importation en cours', {
            type: 'info',
            closeButton: false,
            isLoading: RequestState.creating,
            position: 'bottom-right'
        })

        const response = await Client.post(json, `/${id}/import-result`)

        if (response.ok) {
            toast(response.message, {
                closeButton: true,
                type: 'success',
                position: 'bottom-right'
            })
            resetJSON()
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
                <h1>Importer les resultats pour la phase {id}</h1>
                <NavLink to={`/survey/details/${id}`} className="btn btn-primary">
                    <i className="fa fa-folder me-2"></i>Détails
                </NavLink>
            </div>

            {error && (
                <ApiErrorMessage
                    className="mb-3"
                    message={error.message}
                    onClose={(): void => {
                        resetError()
                    }}
                />
            )}

            <form action="" encType="multipart/form-data">
                <Input
                    type="file"
                    required={true}
                    label="Selectionner un fichier"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="mb-5"
                    onChange={handleFileChange}
                />
            </form>

            <div className="d-flex justify-content-between align-items-center mb-5">
                <h4 className="text-primary">
                    Affichage temporaire des données{' '}
                    {json.length > 0 && `(${json.length} Etudiant(s))`}
                </h4>
                {json.length > 0 && (
                    <Button
                        loading={RequestState.creating}
                        icon="save"
                        type="button"
                        mode="primary"
                        onClick={save}
                    >
                        Enregistrer
                    </Button>
                )}
            </div>
            <hr />

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr className="bg-danger">
                            <th className="text-nowrap">Numéro</th>
                            <th className="text-nowrap">Nom et prénoms</th>
                            <th className="text-nowrap">Date de pésée</th>
                            <th className="text-nowrap">Poids (g)</th>
                            <th className="text-nowrap">Taille (cm)</th>
                            <th className="text-nowrap">Age (mois)</th>
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
                            <tr key={json['numero']}>
                                <td>{json['numero']}</td>
                                <td>{json['noms']}</td>
                                <td>{json['date'].toLocaleDateString()}</td>
                                <td>{json['poids']}</td>
                                <td>{json['taille']}</td>
                                <td>{json['age']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {importing && <Spinner />}

                {json.length > 0 && (
                    <Button
                        loading={RequestState.creating}
                        icon="save"
                        type="button"
                        mode="primary"
                        onClick={save}
                        className="mb-5"
                    >
                        Enregistrer
                    </Button>
                )}
            </div>
        </>
    )
}
