import { useApi } from 'hooks'
import { useParams } from 'react-router-dom'
import { ApiErrorMessage, Block, Button } from 'ui'
import { config, token } from '../../../config'
import { useCallback, useEffect } from 'react'
import { ageMonth } from 'functions'
import { Link } from '@renderer/components'

export function DetailsSurvey(): JSX.Element {
    const {
        Client,
        data: survey,
        RequestState,
        error,
        resetError
    } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: token,
        url: 'surveys'
    })

    const { id } = useParams()

    const getSurvey = async (id: number): Promise<void> => {
        await Client.find(id)
    }

    const refresh = useCallback(() => {
        getSurvey(id as unknown as number)
    }, [])

    useEffect(() => {
        getSurvey(id as unknown as number)
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Détails de la mésure phase: {survey && survey.phase}</h2>
                <div className="d-flex">
                    <Link to="/survey/list" className="btn secondary-link me-2">
                        <i className="fa fa-list me-2"></i>Liste des mésures
                    </Link>
                    <Link to={`/survey/${id}/import-result`} className="btn primary-link">
                        <i className="fa fa-file me-2"></i>Importer des résultat
                    </Link>
                </div>
            </div>

            <Block className="mb-5">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Phase</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {survey && (
                            <tr key={survey.id}>
                                <td>{survey.id}</td>
                                <td>{survey.phase}</td>
                                <td>{survey.date}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Block>

            <Block>
                <div className="mb-5 d-flex justify-content-between">
                    <h3 className="mb-0 text-primary">Resultat de l&apos;enquête</h3>
                    <Button
                        loading={RequestState.loading}
                        onClick={refresh}
                        icon="refresh"
                        type="button"
                        mode="secondary"
                    >
                        Recharger
                    </Button>
                </div>
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
                                <th className="text-nowrap">IMC (kg/m²)</th>
                                <th className="text-nowrap">Z IMC/A</th>
                                <th className="text-nowrap">Z T/P</th>
                                <th className="text-nowrap">Z P/A F</th>
                                <th className="text-nowrap">Z P/A G</th>
                                <th className="text-nowrap">Z T/A F</th>
                                <th className="text-nowrap">Z T/A G</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RequestState.loading === false && survey?.students.length === 0 && (
                                <tr>
                                    <td className="text-center" colSpan={14}>
                                        Aucune données
                                    </td>
                                </tr>
                            )}
                            {RequestState.loading && (
                                <tr>
                                    <td className="text-center" colSpan={14}>
                                        Chargement des données
                                    </td>
                                </tr>
                            )}
                            {survey &&
                                survey.students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="fw-bold">{student.number}</td>
                                        <td className="text-nowrap">
                                            {student.firstname} {student.lastname}
                                        </td>
                                        <td>{student.pivot.date}</td>
                                        <td>{student.pivot.length}</td>
                                        <td>{student.pivot.weight}</td>
                                        <td>{ageMonth(student.birth_date)}</td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.imc}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_imc_age}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_height_weight}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_weight_age_female ?? '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_weight_age_male ?? '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_height_age_female ?? '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {student.pivot.z_height_age_male ?? '-'}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            <Link
                                                to={`/survey/edit-student/${student.id}/${survey.id}`}
                                                className="btn btn-primary btn-sm me-2"
                                            >
                                                <i className="fa fa-edit"></i>
                                            </Link>
                                            <Button
                                                className="text-light"
                                                icon="folder"
                                                size="sm"
                                                mode="info"
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </Block>
        </>
    )
}
