/* eslint-disable react-hooks/exhaustive-deps */
import { Block, Input, PageTitle, PrimaryButton, Select, Spinner } from 'ui'
import { useApi, useAuthStore, useExcelReader } from 'hooks'
import { ChangeEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { ClassSelector, PrimaryLink, ScholarYearSelectorServer, SchoolSelector } from '@base/components'
import { class_categories, config } from '@base/config'
import { isDate } from 'functions'
import { toast } from 'react-toastify'
import { Col, Modal, Row } from '@base/components/Bootstrap';
import { Forbidden } from '../Errors/index.ts'

export function ImportStudentClass(): ReactNode {
    const [isOpen, setIsOpen] = useState(false)
    const [scholarYear, setScholarYear] = useState<string|number>(0)
    const [classeId, setClasseId] = useState<number>(0)
    const [schoolId, setSchoolId] = useState<number>(0)
    const [category, setCategory] = useState<string>('')
    const [sheet, setSheet] = useState<string>('')
    const [forbidden, setForbidden] = useState(false)

    const fileRef = useRef()

    const changeCategory = ({target}: ChangeEvent<HTMLSelectElement>) => {
        setCategory(target.value)
    }

    const changeSheet = ({target}: ChangeEvent<HTMLSelectElement>) => {
        toJSON(fileRef.current as unknown as HTMLInputElement, target.value)
        setSheet(target.value)
        toast('Affichage des données en cours', {
            type: 'info',
            position: config.toastPosition
        })
    }

    const { json, importing, sheets, getSheets, toJSON, resetJSON } = useExcelReader()
    const { Client, RequestState } = useApi<StudentImport>({
        url: '/students'
    })

    const { Client: ClasseClient, datas: classes, RequestState: ClasseRs } = useApi<Classes>({
        url: '/classes',
        key: 'data'
    })

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRs } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    useEffect(() => {
        SchoolClient.get()
        ClasseClient.get()
    }, [])

    const {user} = useAuthStore()

    useEffect(() => {
        if (user?.school) setForbidden(true)
    }, [])

    const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        getSheets(event.target)

        toast('Recuperation des feuilles', {
            type: 'info',
            isLoading: importing,
            position: config.toastPosition
        })

        toJSON(event.target)
    }, [getSheets, toJSON])

    const save = useCallback(async () => {
        toast('Importation en cours', {
            type: 'info',
            closeButton: false,
            isLoading: RequestState.creating,
            position: config.toastPosition
        })

        const data = json.map(d => {
            const key = 'Date de naissance'
            return {
                ...d,
                [key]: isDate(d[key]) ? d[key].toLocaleDateString() : d[key]
            }
        })

        const response = await Client.post({
            students: data as unknown as Student[],
            scholar_year: scholarYear,
            classe_id: classeId,
            school_id: schoolId,
            category: category
        }, '/import-classe')

        if (response.ok) {
            toast(response.message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })

            setSchoolId(0)
            setClasseId(0)
            setCategory('')
            resetJSON()
        } else {
            toast(response.message, {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }, [json, category, schoolId, classeId, scholarYear])

    const canDisplayButton = useCallback(() => {
        return json.length > 0 && scholarYear as number > 0 && classeId > 0
            && schoolId > 0
    }, [json, scholarYear, schoolId, classeId])

    return (
        <>
            <PageTitle title="Importer une liste des étudiants">
                <PrimaryLink permission="" to="/anthropo-measure/student/list" icon="list">
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
                            <li><span className="fw-bold">parents: </span> le nom des parents separé part "et"</li>
                        </ul>
                    </p>

                    <p className='text-justify'><b><u>NB:</u></b> A bien respecter ces nomenclatures (les accents a respecter ainsi que les majuscules et miniscules) afin d'éviter des problèmes de fonctionnement de l'importation.</p>
                </Modal>
                <form>
                    <Row>
                        <Col n={6} className="mb-3">
                            <ScholarYearSelectorServer
                                label="Année scolaire"
                                scholarYear={scholarYear}
                                setScholarYear={setScholarYear}
                            />
                        </Col>
                        <Col n={3} className="mb-3">
                            <ClassSelector
                                label="Classe"
                                datas={classes}
                                classId={classeId}
                                setClassId={setClasseId}
                                loading={ClasseRs.loading}
                            />
                        </Col>
                        <Col n={3} className="mb-3">
                            <Select
                                label="Categorie"
                                value={category}
                                options={class_categories}
                                onChange={changeCategory}
                                required={false}
                                controlled
                            />
                        </Col>
                        <Col n={6}>
                            <SchoolSelector
                                datas={schools}
                                schoolId={schoolId}
                                setSchoolId={setSchoolId}
                                loading={SchoolRs.loading}
                            />
                        </Col>
                        <Col n={3}>
                            <Input
                                ref={fileRef}
                                type="file"
                                required={true}
                                label="Selectionner le fichier"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange}
                            />
                            <i style={{ cursor: 'pointer', position: 'absolute', right: 35, top: 63 }} onClick={() => setIsOpen(true)} className="bi bi-info-circle"></i>
                        </Col>
                        <Col n={3} className="mb-3">
                            <Select
                                label="Feuille"
                                value={sheet}
                                options={sheets}
                                onChange={changeSheet}
                                required={false}
                                controlled
                            />
                        </Col>
                    </Row>
                </form>

                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className='text-primary'>
                        Affichage de la liste{' '}
                        {json.length > 0 && `(${json.length} Etudiant(s))`}
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
                                <th className='bg-primary text-white'>N</th>
                                <th className='bg-primary text-white'>Code</th>
                                <th className='bg-primary text-white'>Nom & Prénoms</th>
                                <th className="text-nowrap bg-primary text-white">Date de naissance</th>
                                <th className='bg-primary text-white'>Sexe</th>
                                <th className='bg-primary text-white'>Nom des parents</th>
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
                            {json.map((json, index) => (
                                <tr key={index}>
                                    <td className='fw-bold'>{index + 1}</td>
                                    <td className='fw-bold'>{json['Code']}</td>
                                    <td>{json['Nom et prénoms']}</td>
                                    <td>
                                        {isDate(json['Date de naissance'])
                                            ? json['Date de naissance'].toLocaleDateString()
                                            : json['Date de naissance']}
                                    </td>
                                    <td>{json['G'] === 'X' ? 'Garçon' : 'Fille'}</td>
                                    <td>{json['Nom des parents']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {importing && <Spinner className="mt-4 text-center" isBorder />}

                {canDisplayButton() && <PrimaryButton
                    permission="student.import"
                    loading={RequestState.creating}
                    icon="save"
                    onClick={save}
                >Enregistrer</PrimaryButton>}
            </Block>}
        </>
    )
}
