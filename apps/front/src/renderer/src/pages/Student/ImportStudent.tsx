import { useApi, useExcelReader } from 'hooks'
import { ChangeEvent } from 'react'
import { Link } from '@renderer/components'
import { Block, Button, Input, Spinner } from 'ui'
import { config, getToken } from '../../../config'
import { toast } from 'react-toastify'
import { isDate } from 'functions'

export function ImportStudent(): JSX.Element {
    const { json, importing, toJSON, resetJSON } = useExcelReader()

    const { Client, RequestState } = useApi<Student>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students'
    })

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

        const response = await Client.post(json as unknown as Student, '/import')

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
                <h2>Importer une liste des étudiants</h2>
                <Link to="/student/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </div>

            <Block className="mb-5">
                <form action="" encType="multipart/form-data">
                    <Input
                        type="file"
                        required={true}
                        label="Selectionner un fichier"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileChange}
                    />
                </form>
            </Block>

            <Block>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h4>
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

                <div className="table-responsive border mb-5">
                    <table className="table table-striped" style={{ fontSize: '10pt' }}>
                        <thead>
                            <tr>
                                <th>Numero</th>
                                <th>Nom & Prénoms</th>
                                <th className="text-nowrap">Date de naissance</th>
                                <th>Sexe</th>
                                <th>Parents</th>
                                <th>Classe</th>
                                <th>Etablissement</th>
                                <th className="text-nowrap">Annee scolaire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {json.length <= 0 && (
                                <tr>
                                    <td className="text-center" colSpan={9}>
                                        Aucun données
                                    </td>
                                </tr>
                            )}
                            {json.map((json) => (
                                <tr key={json['numero']}>
                                    <td>{json['numero']}</td>
                                    <td>{json['noms']}</td>
                                    <td>
                                        {isDate(json['date_naissance'])
                                            ? json['date_naissance'].toLocaleDateString()
                                            : json['date_naissance']}
                                    </td>
                                    <td>{json['sexe']}</td>
                                    <td>{json['parents']}</td>
                                    <td>{json['classe']}</td>
                                    <td>{json['etablissement']}</td>
                                    <td>{json['annee_scolaire']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
            </Block>
        </>
    )
}
