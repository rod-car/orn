/* eslint-disable react-hooks/exhaustive-deps */
import { Block, Input, PageTitle, PrimaryButton, Spinner } from 'ui'
import { useApi, useAuthStore, useExcelReader } from 'hooks'
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { PrimaryLink, ScholarYearSelectorServer } from '@base/components'
import { config } from '@base/config'
import { isDate } from 'functions'
import { toast } from '@base/ui';
import { Col, Modal, Row } from '@base/components/Bootstrap';
import { Forbidden } from '../Errors/Forbidden.tsx'

export function ImportStudent(): ReactNode {
    const [isOpen, setIsOpen] = useState(false)
    const [forbidden, setForbidden] = useState(false)
    const [scholarYear, setScholarYear] = useState<string|number>(0)
    const { json, importing, toJSON, resetJSON } = useExcelReader()
    const { Client, RequestState } = useApi<StudentImport>({
        url: '/students'
    })

    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        toJSON(event.target)

        toast('Affichage des données en cours', {
            type: 'info'
        })
    }, [toJSON])

    const save = useCallback(async () => {
        toast('Importation en cours', {
            type: 'info',
            closeButton: false,
            isLoading: RequestState.creating
        })

        const response = await Client.post({...json as unknown as Student, scholar_year: scholarYear}, '/import')

        if (response.ok) {
            toast(response.message, {
                closeButton: true,
                type: 'success'
            })
            resetJSON()
        } else {
            toast(response.message, {
                closeButton: true,
                type: 'error'
            })
        }
    }, [json])

    const {user} = useAuthStore()

    useEffect(() => {
        if (user?.school) setForbidden(true)
    }, [])

    return (
        <>
            <PageTitle title="Importer une liste des étudiants">
                <PrimaryLink permission="student.view" to="/anthropo-measure/student/list" icon="list">
                    Liste des étudiants
                </PrimaryLink>
            </PageTitle>

            {forbidden ? <Forbidden /> : <Block className="mb-5">
                <Modal title="Consignes" isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <p className='text-justify'>Les colonnes dans le fichier Excel a importer doit avoir le même ordre que celui du tableau en dessous. En utilisant les nomenclatures suivante: 
                        <ul>
                            <li><span className="fw-bold">numero: </span> le numéro de l'étudiant</li>
                            <li><span className="fw-bold">noms: </span> le nom complet</li>
                            <li><span className="fw-bold">date_naissance: </span> la date de naissance</li>
                            <li><span className="fw-bold">sexe: </span> le sexe (Garçon ou Fille)</li>
                            <li><span className="fw-bold">parents: </span> le nom des parents séparé part "et"</li>
                            <li><span className="fw-bold">classe: </span> la classe</li>
                            <li><span className="fw-bold">etablissement: </span> le nom de l'établissement</li>
                            <li><span className="fw-bold">annee_scolaire: </span> l'année scolaire</li>
                        </ul>
                    </p>

                    <p className='text-justify'><b><u>NB:</u></b> A bien respecter ces nomenclatures (les accents a respecter ainsi que les majuscules et miniscule) afin d'éviter des problèmes de fonctionnement de l'importation.</p>
                </Modal>
                <form>
                    <Row>
                        <Col n={6}>
                            <ScholarYearSelectorServer
                                label="Année scolaire"
                                scholarYear={scholarYear}
                                setScholarYear={setScholarYear}
                            />
                        </Col>
                        <Col n={6}>
                            <Input
                                type="file"
                                required={true}
                                label="Selectionner un fichier"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange}
                            />
                            <i style={{ cursor: 'pointer', position: 'absolute', right: 35, top: 63 }} onClick={() => setIsOpen(true)} className="bi bi-info-circle"></i>
                        </Col>
                    </Row>
                </form>

                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className='text-primary'>
                        Affichage temporaire des données{' '}
                        {json.length > 0 && `(${json.length} Étudiant(s))`}
                    </h6>
                    {json.length > 0 && scholarYear as number > 0 && <PrimaryButton
                        permission="student.import"
                        loading={RequestState.creating}
                        icon="save"
                        onClick={save}
                    >Enregistrer</PrimaryButton>}
                </div>

                <div className="table-responsive border">
                    <table className="table table-striped table-hover text-sm">
                        <thead>
                            <tr>
                                <th>Numero</th>
                                <th>Nom & Prénoms</th>
                                <th className="text-nowrap">Date de naissance</th>
                                <th>Sexe</th>
                                <th>Parents</th>
                                <th>Classe</th>
                                <th>Établissement</th>
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
                            {json.map((json, index) => (
                                <tr key={index}>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {importing && <Spinner className="mt-4 text-center" isBorder />}

                {json.length > 0 && scholarYear as number > 0 && <PrimaryButton
                    permission="student.import"
                    loading={RequestState.creating}
                    icon="save"
                    onClick={save}
                >Enregistrer</PrimaryButton>}
            </Block>}
        </>
    )
}
