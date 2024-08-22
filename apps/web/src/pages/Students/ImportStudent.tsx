import { Block, Button, Input, PageTitle, Spinner } from 'ui'
import { useApi, useExcelReader } from 'hooks'
import { ChangeEvent, useState } from 'react'
import { Link } from '@base/components'
import { config } from '@base/config'
import { isDate } from 'functions'
import { toast } from 'react-toastify'
import { Modal } from '@base/components/Bootstrap';

export function ImportStudent(): ReactNode {
    const [isOpen, setIsOpen] = useState(false)
    const { json, importing, toJSON, resetJSON } = useExcelReader()
    const { Client, RequestState } = useApi<Student>({
        baseUrl: config.baseUrl,
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
            position: config.toastPosition
        })

        const response = await Client.post(json as unknown as Student, '/import')

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
            <PageTitle title="Importer une liste des étudiants">
                <Link to="/anthropo-measure/student/list" className="btn primary-link">
                    <i className="bi bi-list me-2"></i>Liste des étudiants
                </Link>
            </PageTitle>

            <Block className="mb-5">
                <Modal title="Consignes" isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <p className='text-justify'>Les colonnes dans le fichier Excel a importer doit avoir le même ordre que celui du tableau en dessous. En utilisant les nomenclatures suivante: 
                        <ul>
                            <li><span className="fw-bold">numero: </span> le numéro de l'étudiant</li>
                            <li><span className="fw-bold">noms: </span> le nom complet</li>
                            <li><span className="fw-bold">date_naissance: </span> la date de naissance</li>
                            <li><span className="fw-bold">sexe: </span> le sexe (Garçon ou Fille)</li>
                            <li><span className="fw-bold">parents: </span> le nom des parents separé part "et"</li>
                            <li><span className="fw-bold">classe: </span> la classe</li>
                            <li><span className="fw-bold">etablissement: </span> le nom de l'établissement</li>
                            <li><span className="fw-bold">annee_scolaire: </span> l'année scolaire</li>
                        </ul>
                    </p>

                    <p className='text-justify'><b><u>NB:</u></b> A bien respecter ces nomenclatures (les accents a respecter ainsi que les majuscules et miniscules) afin d'éviter des problèmes de fonctionnement de l'importation.</p>
                </Modal>
                <form action="" encType="multipart/form-data">
                    <Input
                        type="file"
                        required={true}
                        label="Selectionner un fichier"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileChange}
                    />
                    <i style={{ cursor: 'pointer', position: 'absolute', right: 35, top: 63 }} onClick={() => setIsOpen(true)} className="bi bi-info-circle"></i>
                </form>

                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className='text-secondary'>
                        Affichage temporaire des données{' '}
                        {json.length > 0 && `(${json.length} Etudiant(s))`}
                    </h6>
                    {json.length > 0 && (
                        <Button
                            loading={RequestState.creating}
                            icon="save"
                            type="button"
                            mode="primary"
                            onClick={save}
                        >Enregistrer</Button>
                    )}
                </div>

                <div className="table-responsive border">
                    <table className="table table-striped text-sm">
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
